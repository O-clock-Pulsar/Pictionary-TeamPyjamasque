import {Schema, model, Document} from 'mongoose';

export interface IPicture extends Document {
    user_id : number,
    picture : Buffer 
}

const pictureSchema = new Schema(
    {
        user_id : {
            type : Number,
            required : true,
        },
        picture : {
            type : String,
            required : true,
            unique : true,
        }
    }
)

export default model<IPicture>('Picture', pictureSchema);