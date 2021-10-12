/*
import ISeat from "./../interfaces/seat.interface"
import { Schema, model } from 'mongoose';
const schema = new Schema<ISeat>({
  rowNumber: { type: Number, required: true },
  colNumber: { type: Number, required: true },
  type: { type: String, enum: ["box", "parquet"], required: true }
},
  {
    toObject: {
      virtuals: true
    },
    toJSON: {
      virtuals: true
    },
    timestamps: { createdAt: 'createdAt' }
  });
export default model<ISeat>('seats', schema);
*/