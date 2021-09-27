import { Schema, model, Mongoose } from 'mongoose';
import IHall from "../interfaces/hall.interface";

const schema = new Schema<IHall>({
  number: { type: Number, required: true, unique: true },
  seats: [
    { type: Schema.Types.ObjectId, ref: 'seats', required: false }
  ]
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

schema.virtual('capacity').get(function (this: IHall) {
  return this.seats.length;
});



export default model<IHall>('halls', schema);