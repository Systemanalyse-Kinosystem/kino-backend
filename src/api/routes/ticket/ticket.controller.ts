//replace ticket, Ticket, ITicket
import { Request, Response } from 'express';
import { CallbackError } from 'mongoose';
import Ticket from "./../../models/ticket.model";
import ITicket from '../../interfaces/ticket.interface';
import { IRequestWithUser } from '../../interfaces/jwt.interface';

export default class ticketController {

    static getTicketListForScreening(req: Request, res: Response) {
        Ticket.find({ screening: req.params.screeningId }, (err: CallbackError | null, ticket: ITicket[] | null) => {
            if (!ticket || err) { return res.status(500).json({ err: 'An Error occured' }); }
            res.json(ticket);
        }).populate([{
            path: 'screening',
            populate: [{
                path: 'movie',
                model: 'movies'
            }, {
                path: 'hall',
                model: 'halls'
            }]
        }, {
            path: 'seat'
        }]);
    };

    static getTicketListForLoggedInUser(req: Request, res: Response) {
        Ticket.find({ userID: (<IRequestWithUser>req).user.id }, (err: CallbackError | null, ticket: ITicket[] | null) => {
            if (!ticket || err) { return res.status(500).json({ err: 'An Error occured' }); }
            res.json(ticket);
        })
    };

    static selectTicketById(req: Request, res: Response) {
        Ticket.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, (err: CallbackError | null, ticket: ITicket | null) => {
            if (!ticket || err) { return res.status(500).json({ err: 'An Error occured' }); }
            res.json(ticket);
        });
    }

    static unselectTicketById(req: Request, res: Response) {
        Ticket.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, (err: CallbackError | null, ticket: ITicket | null) => {
            if (!ticket || err) { return res.status(500).json({ err: 'An Error occured' }); }
            res.json(ticket);
        });
    }

    static payTicketById(req: Request, res: Response) {
        Ticket.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, (err: CallbackError | null, ticket: ITicket | null) => {
            if (!ticket || err) { return res.status(500).json({ err: 'An Error occured' }); }
            res.json(ticket);
        });
    }

    static invalidateTicketById(req: Request, res: Response) {
        Ticket.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, (err: CallbackError | null, ticket: ITicket | null) => {
            if (!ticket || err) { return res.status(500).json({ err: 'An Error occured' }); }
            res.json(ticket);
        });
    }

    static deleteTickets(req: Request, res: Response) {
        Ticket.deleteMany((err: CallbackError | null, ticket: ITicket | null) => {
            if (err) { return res.status(500).json({ err: 'An Error occured' }) }
            res.status(204).json({});
        });
    }
}