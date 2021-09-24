//replace PlaceHolderInterface, collection
import { Schema, model } from 'mongoose';
import ICart from '../interfaces/cart.interface';
const schema = new Schema<ICart>({
  tickets: [{
      type: Schema.Types.ObjectId, ref: 'tickets'
  }]
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
export default model<ICart>('carts', schema);