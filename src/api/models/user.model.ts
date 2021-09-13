import { Schema, model } from 'mongoose';
import IUser from "../interfaces/user.interface";

const schema = new Schema<IUser>({
  formOfAddress: { type: String, required: false },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true, select: false },
  role: {
    type: String,
    enum: ['customer', 'admin', 'user'],
    immutable: true,
    required: true
  },
  address: {
    street: { type: String, required: true },
    postalCode: { type: Number, required: true },
    city: { type: String, required: true },
    country: { type: String, required: false, default: 'Deutschland' }
  }

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


//add textIndex for full text search
schema.index({
  name: 'text',
  email: 'text'
})

export default model<IUser>('User', schema);