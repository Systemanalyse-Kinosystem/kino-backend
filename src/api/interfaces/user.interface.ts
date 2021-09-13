import { ExecOptionsWithStringEncoding } from "child_process";
import { Document } from "mongoose";
interface IUser extends Document {
  id: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  formOfAddress: string;
  address: {
    street: string;
    postalCode: number;
    city: string;
    country: string;
  }
}

export default IUser;