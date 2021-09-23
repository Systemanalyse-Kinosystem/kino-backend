import IUser from "./user.interface";
export default interface ITicket {
    id: string;
    _id: string;
    createdAt: string;
    updatedAt: string;
    userID: string;
    user: IUser;
    screening: string;
    status: string;
    seat: string;
}