import {Schema, model, Document} from 'mongoose';

interface IWord extends Document {
    word: string,
    // category: string,
    // level: number,
}

const wordSchema = new Schema(
    {
        worde: {
            type: String,
            required: true,
            unique: true
        },
        // category : {
        //     type: String,
        //     required: true,
        //     unique: true
        // },
        // level: {
        //     type: Number,
        //     required: true
        // }
    }
)

export default model<IWord>('Word', wordSchema);