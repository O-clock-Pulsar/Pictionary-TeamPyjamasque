import {Schema, model, Document} from 'mongoose';

interface IGame extends Document {
    game : string,
    players : [number],
    winner : number,
    client_id : number,
    room : number,
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
            minlength: 2
        },
        winner : {
            type : Number,
            required : false,
            unique : true,
        },
        client_id : {
            type : Number,
            required : true,
            unique : true,
        },
        room : {
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
            unique : true,
        }
    }
)

export default model<IGame>('Game', gameSchema);