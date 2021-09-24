import ITicket from "./ticket.interface";

export default interface ICart {
    id: string;
    _id: string;
    createdAt: Date;
    updatedAt: Date;
    tickets: ITicket[];
}

export interface ICartNotPopulated extends Omit<ICart, 'tickets'> {
    tickets: string[];
}