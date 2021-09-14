//replace PlaceHolderInterface, collection
import { Schema, model } from 'mongoose';
const schema = new Schema<any>({
  test: { type: String},
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
export default model<any>('movies', schema);