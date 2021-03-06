import { Service } from "typedi";
import User, { IUser } from '../models/User';
import {IRegistrationResult, IUserServiceResults} from '../Interfaces/UserService';
import {promises} from 'fs';
import bcrypt from 'bcrypt';
import owasp from 'owasp-password-strength-test';

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
        if(ids.length){
            messages.push("Tous les champs sont réquis.");
        }
        if (password !== confirmation){
            messages.push("Les mots de passe ne sont pas identiques.");
            ids.push("password");
            ids.push("confirmation");
        }
        owasp.config({maxLength: 60});
        const passwordResults = owasp.test(password);
        if (passwordResults.errors.length){
            messages.push("Votre mot de passe n'est pas assez sécurisé. Passez sur les ? sous le champ du mot de passe pour plus d'information.");
            ids.push("password");
        }
        if (email || username){
        email = email.trim().toLowerCase();
            try{
                user = await User.findOne({$or:[{email}, {username}]});
                if (!user && !messages.length){
                    username = username.trim();
                    user = await new User({username, password, email}).save();
                }   else {
                    messages.push("L'utilisateur existe déjà. Veuillez désigner un autre email ou nom d'utilisateur.");
                    ids.push("email");
                }
            } catch (e) {messages.push("Une erreur inconnue s'est produite.")}
        }
        if(messages.length) {
            error = true;
         } else {
            error = false;
            messages.push("L'utilisateur a été créé.");
        };
        return {user, error, messages, ids};
    }

    async uploadAvatar(avatarData: Express.Multer.File, userInfo: IUser): Promise<IUserServiceResults> {
        try{
            const name = encodeURIComponent(avatarData.originalname.trim());
            const user = await User.findByIdAndUpdate(userInfo.id, {avatar: name}, {new: true})
            await promises.writeFile(`${__dirname}../../../public/uploads/avatars/${user.avatar}`, avatarData.buffer);
            return {error: false, message: "L'avatar de l'utilisateur a été enregistré avec succès."}
        } catch (e) {return {error: true, message: "Une erreur s'est produite lors de'enregistrement de l'image, mais le compte a été créé."}}
    }

    async authenticateUser(username: string, password: string): Promise<IUserServiceResults> {
        username = username.trim();
        const user: IUser = await User.findOne({username});
        let passwordCheck = false;
        if (user) {
            password = password.trim();
            passwordCheck = bcrypt.compareSync(password, user.password);
        }
        if (!user || !passwordCheck){
            return {error: true, message: "L'utilisateur n'a pas été trouvé ou le mot de passe n'est pas reconnu."};
        }
        return {error: false, message: ""};
    }
}