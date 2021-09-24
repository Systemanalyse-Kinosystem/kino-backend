import ITicket from "./ticket.interface";

export default interface ICart {
    id: string;
    _id: string;
    createdAt: Date;
    updatedAt: Date;
    tickets: ITicket[];
}