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
    timestamps: { createdAt: 'createdAt' }
  });

//index already defined in atlas
export default model<any>('movies', schema);