import { Schema, model, Mongoose } from 'mongoose';
import IHall from "../interfaces/hall.interface";

const schema = new Schema<IHall>({
  number: { type: Number, required: true, unique: true},
  //add capacity as virtual
  capacity: { type: Number, required: true},
  seats: [
    {type: Schema.Types.ObjectId, ref:'seats', required: false}
  ]
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

//add textIndex for full text search
schema.index({

})

export default model<IHall>('halls', schema);