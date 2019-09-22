import { Service } from "typedi";
import Game from '../models/Game';
import adjNoun from 'adj-noun';
import {GameServiceResult} from '../Interfaces/GameService';

adjNoun(1 || process.env.ADJ_NOUN_SEED);

@Service()
export default class GameService {
    async createGame(host: string): Promise<GameServiceResult> {
        let game = await Game.findOne({host});
        let alreadyExists = true;
        let message = "Vous avez déjà une partie en cours."
        if (!game){
            const namespace =  adjNoun().join('-');
            game = await new Game({
                host,
                players: [host],
                namespace
            }).save();
            alreadyExists = false;
            message = "Vous avez commencé une nouvelle partie."
        }
        return {game, alreadyExists, message};
    }
}