import { Schema, model } from 'mongoose';
import IUser from "../interfaces/user.interface";

const schema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true, select: false },
  role: {
    type: String,
    enum: ['customer', 'admin', 'user', 'sysadmin'],
    immutable: true
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