import { Service } from "typedi";
import User, { IUser } from '../models/User';
import {IRegistrationResult} from '../Interfaces/UserService'

@Service()
export default class UserService {

    async createUser({username, email, password, confirmation}) : Promise<IRegistrationResult> {
        let messages: Array<string> = [];
        let error: boolean;
        let user: IUser;
        if (!username || !email || !password || !confirmation){
            messages.push("Tous les champs sont réquis.");
        }
        if (password !== confirmation){
            messages.push("Les mots de passe ne sont pas identiques.");
        }
        if (messages.length === 0){
            email = email.trim().toLowerCase();
            try{
                user = await User.findOne({email});
                if (!user){
                    username = username.trim();
                    user = await new User({username, password, email}).save();
                }   else messages.push("L'utilisateur existe déjà.");
            } catch (e) {messages.push("Une erreur inconnue s'est produite.")}
        }
        if(messages.length !== 0) {
            error = true;
         } else {
            error = false;
            messages.push("L'utilisateur a été créé.");
        };
        return {user, error, messages};
    }
}