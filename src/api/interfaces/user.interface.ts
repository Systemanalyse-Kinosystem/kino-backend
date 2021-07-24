import { Document } from "mongoose";
interface IUser extends Document {
  id: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  email: string;
  cinema: string;
  password: string;
  role: string;
}

export default IUser;