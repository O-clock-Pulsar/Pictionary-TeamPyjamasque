import { Document, Schema, model } from 'mongoose';

export interface IGame extends Document {
  host: string;
  players: [string];
  winner: number;
  namespace: string;
  date: Date;
  library_id: number;
}

const gameSchema = new Schema({
  host: {
    type: String,
    required: true,
  },
  players: {
    type: [String],
    required: true,
  },
  winner: {
    type: Number,
    required: false,
  },
  namespace: {
    type: String
  },
  date: {
    type: Date,
    required: true,
    default: new Date(),
  },
  library_id: {
    type: Number,
    required: true,
    default: 1,
  },
});

export default model<IGame>('Game', gameSchema);
