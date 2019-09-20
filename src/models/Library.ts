import {Schema, model, Document} from 'mongoose';

export interface ILibrary extends Document {
    name : string,
}

const librarySchema = new Schema(
    {
        name : {
            type : String,
            required : true,
        },
    }
)

export default model<ILibrary>('Library', librarySchema);