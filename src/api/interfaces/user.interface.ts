import {Document} from "mongoose";
interface IUser extends Document{
    name: string;
    email: string;
    password: string;
    role: string;
  }

  export default IUser;