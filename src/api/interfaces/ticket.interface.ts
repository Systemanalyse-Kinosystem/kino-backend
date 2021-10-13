import IScreening from "./screening.interface";
import ISeat from "./seat.interface";
import IUser from "./user.interface";
export default interface ITicket {
    id: string;
    _id: string;
    createdAt: string;
    updatedAt: string;
    userID: string | IUser;
    user: IUser;
    screening: string | IScreening;
    status: string;
    seat: ISeat
}