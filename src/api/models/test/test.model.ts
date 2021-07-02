import { Schema, model } from 'mongoose';
import IUser from "./test.interface";

const schema = new Schema<IUser>({
  name: { type: String, required: true }
});

export default model<IUser>('User', schema);