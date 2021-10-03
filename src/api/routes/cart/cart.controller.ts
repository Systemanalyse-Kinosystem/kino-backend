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

    static async getCartById(req: Request, res: Response) {
        try {
            let cart = await Cart.findOne({ _id: req.params.id });
            if (!cart) { return res.status(400).json({ err: "Not found" }); }
            res.json(cart);
        } catch (e) { res.status(500).json(e); }
    };

    static async createCart(req: Request, res: Response) {
        try {
            let cart = await Cart.create({ tickets: [] });
            if (!cart) { return res.status(400).json({ err: "Not found" }); }
            res.status(201).json(cart);
        } catch (e) { res.status(500).json(e); }
    }

    static async checkOutCartBookWithCartId(req: Request, res: Response) {
        try {
            let cart = await Cart.findById(req.params.id);
            if (!cart) { return res.status(400).json({ err: "Cart not found" }); }

            await Ticket.updateMany({ _id: { $in: cart.tickets } }, { "$set": { status: "valid", user: req.body } }, { "multi": true });

            let cartUpdated = await Cart.findOneAndUpdate({ _id: req.params.id }, { tickets: [] }, { new: true });
            if (!cartUpdated) { return res.status(400).json({ err: "Not found" }); }
            res.json(cartUpdated);

            //send Mail
            utils.sendBookingEmail(req.body.email, cart.tickets)
        } catch (e) { res.status(500).json(e); }
    }


    /* NOT NEEDED FOR MVP
        static checkOutCartBookWithLogin(req: Request, res: Response) {
            //implement
        }
    */

    static async checkOutCartReserveWithLogin(req: Request, res: Response) {
        let cart = await Cart.findById(req.params.id);
        if (!cart) { return res.status(400).json({ err: "Cart not found" }); }

        await Ticket.updateMany({ _id: { $in: cart.tickets } }, { "$set": { status: "reserved", userID: (<IRequestWithUser>req).user.id } }, { "multi": true });

        let updatedCart = await Cart.findOneAndUpdate({ _id: req.params.id }, { tickets: [] }, { new: true });
        if (!updatedCart) { return res.status(400).json({ err: "Not found" }); }
        utils.sendReservationEmail(req.body.email, cart.tickets);
        res.json(updatedCart);
    }
}