import { Document } from "mongoose";
interface ICinema extends Document {
    id: string;
    _id: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    adminMail: string;
    halls: [string];
    adress: {
        street: string;
        postalCode: number;
        city: string;
        country: string;
    }
}

export default ICinema;