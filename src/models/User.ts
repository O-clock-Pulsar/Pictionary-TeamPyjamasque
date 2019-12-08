import { Document, Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

const hash = (data: string): string => bcrypt.hashSync(data,
  parseInt(process.env.SALT_ROUNDS) || 1);

const emailCheck = (unhashedEmail: string): any => {
  emailRegExp.test(unhashedEmail);
};

const emailRegExp: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export interface IUser extends Document {
    username: string,
    email: string,
    password: string,
    avatar: Buffer,
    client_id: number,
    victories: number,
    game_id: number,
    created_at: Date,
    updated_at: Date
}

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 4,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: emailCheck,
      },
    },
    password: {
      type: String,
      required: true,
      set: hash,
    },
    avatar: {
      type: String,
    },
    victories: {
      type: Number,
      default: 0,
    },
    client_id: {
      type: Number,
    },
    game_id: {
      type: Number,
    },
    created_at: {
      type: Date,
      required: true,
      default: new Date(),
    },
    updated_at: {
      type: Date,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

export default model<IUser>('User',
  userSchema);
