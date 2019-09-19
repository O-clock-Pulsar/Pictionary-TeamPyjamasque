import {Schema, model, Document} from 'mongoose';

interface IWord extends Document {
    word: string,
    library_id : number,
}

const wordSchema = new Schema(
    {
        word: {
            type: String,
            required: true,
            unique: true
        },
        library_id : {
            type : Number,
            required : true, 
            unique: true,
        }
    }
)

export default model<IWord>('Word', wordSchema);