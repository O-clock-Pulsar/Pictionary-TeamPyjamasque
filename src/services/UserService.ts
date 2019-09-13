import { Service } from "typedi";
import User, { IUser } from '../models/User';
import {IRegistrationResult, IAvatarResult} from '../Interfaces/UserService'
import {promises} from 'fs';

@Service()
export default class UserService {

    async createUser({username, email, password, confirmation}): Promise<IRegistrationResult> {
        let messages: Array<string> = [];
        let ids: Array<string> = [];
        let error: boolean;
        let user: IUser;
        for (let key in arguments[0]){
            if (!arguments[0][key]){
                ids.push(key);
            }
        }
        if(ids.length !== 0){
            messages.push("Tous les champs sont réquis.");
        }
        if (password !== confirmation){
            messages.push("Les mots de passe ne sont pas identiques.");
            ids.push("password");
            ids.push("confirmation");
        }
        if (email || username){
        email = email.trim().toLowerCase();
            try{
                user = await User.findOne({$or:[{email}, {username}]});
                if (!user){
                    username = username.trim();
                    user = await new User({username, password, email}).save();
                }   else {
                    messages.push("L'utilisateur existe déjà. Veuillez désigner un autre email ou nom d'utilisateur.");
                    ids.push("email");
                }
            } catch (e) {messages.push("Une erreur inconnue s'est produite.")}
        }
        if(messages.length !== 0) {
            error = true;
         } else {
            error = false;
            messages.push("L'utilisateur a été créé.");
        };
        return {user, error, messages, ids};
    }

    async uploadAvatar(avatarData: Express.Multer.File, userInfo: IUser): Promise<IAvatarResult> {
        try{
            const user = await User.findByIdAndUpdate(userInfo.id, {avatar: avatarData.originalname}, {new: true})
            await promises.writeFile(`${__dirname}../../../public/uploads/avatars/${user.avatar}`, avatarData.buffer);
            return {error: false, message: "L'avatar de l'utilisateur a été enregistré avec succès."}
        } catch (e) {return {error: true, message: "Une erreur s'est produite lors de'enregistrement de l'image, mais le compte a été créé."}}
    }
}