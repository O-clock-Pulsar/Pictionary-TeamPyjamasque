import { Service } from "typedi";
import Game, { IGame } from '../models/Game';
import IWord from '../models/Word';
import adjNoun from 'adj-noun';
import { IGameServiceResult, IPlayerResult } from '../Interfaces/GameService';
import io from 'socket.io-client';

const socketAddress = process.env.SOCKET_IO_ADDRESS_HTTP_PROTOCOL ? process.env.SOCKET_IO_ADDRESS_HTTP_PROTOCOL+":"+process.env.SOCKET_IO_PORT : 'http://localhost:5060/'
const socket = io(socketAddress)

adjNoun(process.env.ADJ_NOUN_SEED || 1);

@Service()
export default class GameService {
    async createGame(host: string): Promise<IGameServiceResult> {
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
            this.getUniqueNamespace();
        } else return namespace;
    }

    async endGame(namespace: string): Promise<IGame>{
        return await Game.findOneAndUpdate({namespace}, {namespace: null}, {new:true});
    }

    async startRound(namespace: string, username: string) {
        let round = true;
        let ready = true;
        const game = await Game.findOneAndUpdate({namespace}, {$addToSet: {players: username}}, {new: true});
        const playerList = game.players;
    }

    async readyCheck({namespace}) {
        let round = true;
        let ready = true;
        socket.emit('ready check', namespace)
    }

    async getRoundWord() {
        const word =  await IWord.findOne();
        console.log(word);
    }

    async getPlayerList(namespace: string) {
        // let playerList = await Game.find({namespace},{$pull:{players: username}});
        const game = await Game.findOne({namespace});
        const playerList = game.players;
        console.log(playerList);
        return playerList;
    }

    async dispatchWord(namespace: string,username: string) {
        const game = await Game.findOne({namespace}, {players: username});
        const playerList = game.players;
        let word = this.getRoundWord();
        // playerList.forEach(element => this.round.word);
        playerList.forEach(function(){
            if('drawer'){
                socket.emit(this.word);
            }
            else if('answerer'){
                socket.emit(this.bcrypt.word);
            }
            else{
                console.log(('something gones wrong:'));
            }
        })
    }

    
    
}