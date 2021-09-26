//replace cart, Cart, ICart
import { Request, Response } from 'express';
import { CallbackError } from 'mongoose';
import ICart, { ICartNotPopulated } from '../../interfaces/cart.interface';
import Cart from '../../models/cart.model';
import Ticket from '../../models/ticket.model';
import ITicket from '../../interfaces/ticket.interface';
import { IRequestWithUser } from '../../interfaces/jwt.interface';
import nodemailer from "nodemailer";
import utils from "../../utils/utils";

export default class cartController {

    static getCartById(req: Request, res: Response) {
        Cart.findOne({ _id: req.params.id }, (err: CallbackError | null, cart: ICart | null) => {
            if (!cart || err) { return res.status(500).json({ err: err ? err : "Not found" }); }
            res.json(cart);
        })
    };

    static createCart(req: Request, res: Response) {
        Cart.create({ tickets: [] }, (err: CallbackError | null, cart: ICartNotPopulated | null) => {
            if (err || !cart) { return res.status(400).json({ err: err ? err : "Not found" }); }
            res.status(201).json(cart);
        });
    }

    static checkOutCartBookWithCartId(req: Request, res: Response) {
        Cart.findById(req.params.id, (err: CallbackError | null, cart: ICartNotPopulated | null) => {
            if (err) { return res.status(500).json({ err: err }); }
            if (!cart) { return res.status(400).json({ err: "Cart not found" }); }
            Ticket.updateMany({ _id: { $in: cart.tickets } }, { "$set": { status: "valid" } }, { "multi": true }, (err: CallbackError | null, writeResult: any) => {
                if (err) { return res.status(500).json({ err: err }); }
                Cart.findOneAndUpdate({ _id: req.params.id }, { tickets: [], user: req.body }, { new: true }, (err: CallbackError | null, cartUpdated: ICartNotPopulated | null) => {
                    if (err) { return res.status(500).json({ err: err }); }
                    if (!cartUpdated) { return res.status(400).json({ err: "Not found" }); }
                    res.json(cartUpdated);
                    //send Mail
                    let mailText = "Sie haben folgende Tickets bestellt: "
                    for(let ticket of cart.tickets) {
                        mailText += `TicketID: ${ticket} `
                    }
                    utils.getNodeMailerTransporter().sendMail({
                        from: 'noreply.kinosystem@gmail.com',
                        to: req.body.email,
                        subject: 'Ihre Bestellung',
                        text: mailText
                    }, (err, info) => {
                        if(err) {console.error(err);}
                    });

                });
            });
        });
    }
    /* NOT NEEDED FOR MVP
        static checkOutCartBookWithLogin(req: Request, res: Response) {
            //implement
        }
    */

    static checkOutCartReserveWithLogin(req: Request, res: Response) {
        Cart.findById(req.params.id, (err: CallbackError | null, cart: ICartNotPopulated | null) => {
            if (err) { return res.status(500).json({ err: err }); }
            if (!cart) { return res.status(400).json({ err: "Cart not found" }); }
            Ticket.updateMany({ _id: { $in: cart.tickets } }, { "$set": { status: "reserved", userID: (<IRequestWithUser>req).user.id } }, { "multi": true }, (err: CallbackError | null, writeResult: any) => {
                if (err) { return res.status(500).json({ err: err }); }
                Cart.findOneAndUpdate({ _id: req.params.id }, { tickets: [] }, { new: true }, (err: CallbackError | null, cart: ICartNotPopulated | null) => {
                    if (err) { return res.status(500).json({ err: err }); }
                    if (!cart) { return res.status(400).json({ err: "Not found" }); }
                    //sendMail
                    res.json(cart);
                });
            });
        });
    }

}

/*
booking:
findCart
mark the tickets as booked
clear cart
send mail
*/