import { Document } from "mongoose";
import ISeat from "./seat.interface";
interface IHall extends Document {
    id: string;
    _id: string;
    createdAt: string;
    updatedAt: string;
    number: number;
    capacity: number;
    seats: [
        string | ISeat
    ]
}

export default IHall;