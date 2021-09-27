//replace PlaceHolderInterface, collection
import { Schema, model } from 'mongoose';
import ICart, { ICartNotPopulated } from '../interfaces/cart.interface';
const schema = new Schema<ICartNotPopulated>({
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
    timestamps: { createdAt: 'createdAt' }
  });
export default model<ICartNotPopulated>('carts', schema);