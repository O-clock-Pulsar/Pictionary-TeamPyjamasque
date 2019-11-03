import { Service } from "typedi";
import Game, { IGame } from '../models/Game';
import adjNoun from 'adj-noun';
import {GameServiceResult, PlayerResult} from '../Interfaces/GameService';
import io from 'socket.io-client';

const socket = io(process.env.SOCKET_IO_ADDRESS+process.env.SOCKET_IO_PORT || "http://localhost:5060")

adjNoun(process.env.ADJ_NOUN_SEED || 1);

@Service()
export default class GameService {
    async createGame(host: string): Promise<GameServiceResult> {
        let game = await Game.findOne({host, namespace: {$ne: null}});
        let alreadyExists = true;
        let message = "Vous avez déjà une partie en cours.";
        if (!game){
            const namespace = await this.getUniqueNamespace();
            game = await new Game({
                host,
                players: [host],
                namespace
            }).save();
            socket.emit('game start', namespace);
            alreadyExists = false;
            message = "Vous avez commencé une nouvelle partie.";
        }
        return {game, alreadyExists, message};
    }

    async addToPlayerList(namespace: string, username: string): Promise<PlayerResult> {
        let ready = false;
        const game = await Game.findOneAndUpdate({namespace}, {$addToSet: {players: username}}, {new: true});
        const playerList = game.players;
        if (playerList.length >= 2) {
            ready = true;
        }
        return {playerList, ready};
    }

    async removeFromPlayerList(namespace: string, username: string): Promise<PlayerResult> {
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
            this.getUniqueNamespace();
        } else return namespace;
    }

    async endGame(namespace: string): Promise<IGame>{
        return await Game.findOneAndUpdate({namespace}, {namespace: null}, {new:true});
    }
}