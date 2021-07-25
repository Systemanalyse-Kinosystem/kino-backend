import { Schema, model } from 'mongoose';
import IHall from "../interfaces/hall.interface";

const schema = new Schema<IHall>({
  //add autoIncrement
  number: { type: Number, required: true, unique: true},
  capacity: { type: Number, required: true},
  cinema: {type: Schema.Types.ObjectId, ref:'Cinema'}
},
{
    toObject: {
      virtuals: true
    },
    toJSON: {
      virtuals: true
    },
    timestamps: {createdAt: 'createdAt'}
  });


export default model<IHall>('Hall', schema);