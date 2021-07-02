import { Schema, model } from 'mongoose';
import IUser from "../interfaces/user.interface";

const schema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: {type: String, required: true}
});

export default model<IUser>('User', schema);