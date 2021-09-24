//replace ticket, Ticket, ITicket
import { Request, Response } from 'express';
import { CallbackError } from 'mongoose';
import Ticket from "./../../models/ticket.model";
import ITicket from '../../interfaces/ticket.interface';
import { IRequestWithUser } from '../../interfaces/jwt.interface';
import Cart from '../../models/cart.model';
import ICart, { ICartNotPopulated } from '../../interfaces/cart.interface';

export default class ticketController {

    static getTicketListForScreening(req: Request, res: Response) {
        Ticket.find({ screening: req.params.screeningId }, (err: CallbackError | null, tickets: ITicket[] | null) => {
            if (!tickets || err) { return res.status(500).json({ err: err }); }
            res.json(tickets);
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
            if (!ticket || err) { return res.status(500).json({ err: err }); }
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

    static selectTicketById(req: Request, res: Response) {

        Cart.findById(req.params.cartId, (err: CallbackError, cart: ICartNotPopulated) => {
            let oldTickets = cart.tickets;
            if (!cart || err) { return res.status(500).json({ err: err }); }
            let newTickets = [...oldTickets, req.params.ticketId];

            Cart.findOneAndUpdate({ _id: req.params.cartId }, { tickets: newTickets }, { new: true }, (err: CallbackError | null, cart: ICartNotPopulated | null) => {
                if (!cart || err) { return res.status(500).json({ err: err }); }

                Ticket.findOneAndUpdate({ _id: req.params.ticketId, status: "available" }, { status: "selected" }, { new: true }, (err: CallbackError | null, ticket: ITicket | null) => {
                    if (!ticket || err) { 
                        Cart.findOneAndUpdate({ _id: req.params.cartId }, { tickets: oldTickets }, { new: true }, (err: CallbackError | null, cart: ICartNotPopulated | null) => {
                        return res.status(500).json({ err: err }); 
                        });
                    } else {

                    return res.json(ticket);
                    }
                });
            });
        })

    }

    static unselectTicketById(req: Request, res: Response) {
        Ticket.findOneAndUpdate({ _id: req.params.ticketId }, req.body, { new: true }, (err: CallbackError | null, ticket: ITicket | null) => {
            if (!ticket || err) { return res.status(500).json({ err: err }); }
            res.json(ticket);
        });
    }

    static payTicketById(req: Request, res: Response) {
        Ticket.findOneAndUpdate({ _id: req.params.ticketId }, req.body, { new: true }, (err: CallbackError | null, ticket: ITicket | null) => {
            if (!ticket || err) { return res.status(500).json({ err: err }); }
            res.json(ticket);
        });
    }

    static invalidateTicketById(req: Request, res: Response) {
        Ticket.findOneAndUpdate({ _id: req.params.ticketId }, req.body, { new: true }, (err: CallbackError | null, ticket: ITicket | null) => {
            if (!ticket || err) { return res.status(500).json({ err: err }); }
            res.json(ticket);
        });
    }

    static deleteTickets(req: Request, res: Response) {
        Ticket.deleteMany((err: CallbackError | null, ticket: ITicket | null) => {
            if (err) { return res.status(500).json({ err: err }) }
            res.status(204).json({});
        });
    }
}