import { Schema, model } from 'mongoose';
import ICinema from "../interfaces/cinema.interface";

const schema = new Schema<ICinema>({
  name: { type: String, required: true },
  adminMail: { type: String, required: true, immutable: true},
  adress: {
      street: {type: String, required: true},
      postalCode: {type: Number, required: true},
      city: {type: String, required: true},
      country: {type: String, required: true, default: 'Germany'}
  }
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



export default model<ICinema>('Cinema', schema);