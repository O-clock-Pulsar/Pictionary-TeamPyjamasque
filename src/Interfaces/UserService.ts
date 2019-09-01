import { IUser } from '../models/User';

export interface IRegistrationResult {
    user: IUser;
    error: boolean;
    messages: Array<string>
}