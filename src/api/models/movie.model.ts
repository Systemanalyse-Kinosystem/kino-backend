//replace PlaceHolderInterface, collection
import { Schema, model } from 'mongoose';
const schema = new Schema<any>({
  title: { type: String },
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

  schema.index({
    title: 'text'
  })
  
export default model<any>('movies', schema);