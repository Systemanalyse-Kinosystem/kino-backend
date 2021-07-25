import { Document } from "mongoose";
interface IHall extends Document {
    id: string;
    _id: string;
    createdAt: string;
    updatedAt: string;
    number: number;
    capacity: number;
}

export default IHall;