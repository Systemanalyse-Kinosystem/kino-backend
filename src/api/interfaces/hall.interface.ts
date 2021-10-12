import { Document } from "mongoose";
import ISeat from "./seat.interface";
interface IHall extends Document {
    number: number;
    capacity: number;
    rows: number;
    seatsPerRow: number;
}

export default IHall;