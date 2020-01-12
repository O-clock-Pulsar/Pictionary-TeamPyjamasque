import { Service } from "typedi";
import Game, { IGame } from '../models/Game';
import Word from '../models/Word';
import adjNoun from 'adj-noun';
import { IGameServiceResult, IPlayerResult, IRoleAssignment } from '../Interfaces/GameService';

// Add this as a dependency ?
adjNoun.seed(parseInt(process.env.ADJ_NOUN_SEED) || 1);

@Service()
export default class GameService {
    async createGame(host: string): Promise<IGameServiceResult> {
        let game = await Game.findOne({host, namespace: {$ne: null}});
        let alreadyExists = true;
        let message = "Vous avez déjà une partie en cours.";
        let namespace = "";
        if (!game){
            namespace = await this.getUniqueNamespace();
            game = await new Game({
                host,
                players: [host],
                namespace
            }).save();
            alreadyExists = false;
            message = "Vous avez commencé une nouvelle partie.";
        } else {
            namespace = game.namespace
        }
        return {game, alreadyExists, message, namespace};
    }

    async addToPlayerList(namespace: string, username: string): Promise<IPlayerResult> {
        let ready = false;
        const game = await Game.findOneAndUpdate({namespace}, {$addToSet: {players: username}}, {new: true});
        const playerList = game.players;
        if (playerList.length >= 2) {
            ready = true;
        }
        return {playerList, ready};
    }

    async removeFromPlayerList(namespace: string, username: string): Promise<IPlayerResult> {
        let ready = false;
        let game = await Game.findOneAndUpdate({namespace}, {$pull: {players: username}}, {new: true});
        const playerList = game.players;
        if (playerList.length >= 2) {
            ready = true;
        }
        return {playerList, ready};
    }

    async getUniqueNamespace(): Promise<string> {
        const namespace = adjNoun().join('-');
        const game = await Game.findOne({namespace});
        if (game){
            return this.getUniqueNamespace();
        } else return namespace;
    }

    async endGame(namespace: string, playerList: string[]): Promise<IGame>{
        return await Game.findOneAndUpdate({namespace}, {namespace: null, playerList}, {new:true});
    }

    async getRoundWord() {
        const document = await Word.aggregate([{ $sample: {size: 1} }]);
        return document[0].word;
    }

    getCurrentGames(): Promise<IGame[]> {
        return Game.find({namespace: {$ne: null}}).exec();
    }

    async assignRoles(namespace: string, exDrawers: string[]): Promise<IRoleAssignment> {
        let drawer = "";
        let answerers: string[] = [];
        try{
            const {players} = await Game.findOne({namespace});
            const playersLeft = players.filter(x => !exDrawers.includes(x))
            if(playersLeft.length){
                drawer = playersLeft[Math.floor(Math.random() * playersLeft.length)];
            } else drawer = null;
            answerers = [...players];
            answerers.splice(answerers.indexOf(drawer),
              1);
            return {drawer, answerers}
        } catch (e) {
            console.log(e)
            return {drawer: null, answerers: null}
        }
    }
}