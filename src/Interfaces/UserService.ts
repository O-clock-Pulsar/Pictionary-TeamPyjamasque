import { IUser } from '../models/User';

export interface IRegistrationResult {
    user: IUser;
    error: boolean;
    messages: Array<string>
    ids: Array<string>
}

export interface IAvatarResult {
    error: boolean;
    message: string
}