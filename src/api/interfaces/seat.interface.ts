import { Document } from "mongoose";
export default interface ISeat extends Document {
     rowNumber: number;
     colNumber: number;
     type: string;
}
