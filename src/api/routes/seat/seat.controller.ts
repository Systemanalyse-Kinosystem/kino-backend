import { Request, Response } from 'express';
import { CallbackError } from 'mongoose';
import ISeat from '../../interfaces/seat.interface';
import Seat from '../../models/seat.model';

export default class seatController {

    static getSeatList(req: Request, res: Response) {
        Seat.find({}, (err: CallbackError | null, seat: ISeat[] | null) => {
            if (!seat || err) { return res.status(500).json({ err: 'An Error occured' }); }
            res.json(seat);
        })
    };
    /* TEMPEXCLUDE FOR MVP
    static getSeatById(req: Request, res: Response) {
        Seat.findOne({ _id: req.params.id }, (err: CallbackError | null, seat: ISeat | null) => {
            if (!seat || err) { return res.status(500).json({ err: 'An Error occured' }); }
            res.json(seat);
        })
    };
    

    static createSeat(req: Request, res: Response) {
        Seat.create(req.body, (err: CallbackError | null, seat: ISeat | null) => {
            if (err || !seat) { return res.status(500).json({ err: 'An Error occured' }); }
            res.json(seat);
        });
    }

    static deleteSeatById(req: Request, res: Response) {
        Seat.findOneAndDelete({
        }, {}, (err: CallbackError | null, seat: ISeat | null) => {
            if (err) { return res.status(500).json({ err: 'An Error occured' }); }
            res.status(204).json({});
        });
    }
    */
    static deleteSeats(req: Request, res: Response) {
        Seat.deleteMany((err: CallbackError | null, seat: ISeat | null) => {
            if (err) { return res.status(500).json({ err: 'An Error occured' }) }
            res.status(204).json({});
        });
    }
/*
    static updateSeatById(req: Request, res: Response) {
        Seat.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, (err: CallbackError | null, seat: ISeat | null) => {
            if (!seat || err) { return res.status(500).json({ err: 'An Error occured' }); }
            res.json(seat);
        });
    }
    */
}