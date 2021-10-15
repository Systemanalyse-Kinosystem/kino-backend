import IHall from "./hall.interface";

export default interface IScreening {
    id: string;
    _id: string;
    movie: any;
    startDate: Date;
    endDate: Date;
    hall: IHall;
    createdAt: Date;
    updatedAt: Date;
    freeSeats: Number;
}