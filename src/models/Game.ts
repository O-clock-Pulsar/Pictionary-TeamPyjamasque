import {Schema, model, Document} from 'mongoose';

interface IGame extends Document {
    host : string,
    players : [number],
    winner : number,
    namespace : number,
    date : Date,
    library_id : number
}

const gameSchema = new Schema(
    {
        host : {
            type : String,
            required : true,
            unique : true,
        },
        players : {
            type : [Number],
            required : true,
            unique : true,
        },
        winner : {
            type : Number,
            required : false,
            unique : false,
        },
        namespace : {
            type : Number,
            required : true,
            unique : true,
        },
        date : {
            type : Date,
            required : true,
            default : new Date(),
        },
        library_id :{
            type : Number,
            required : true,
            default : 1,
            unique : false,
        }
    }
)

export default model<IGame>('Game', gameSchema);