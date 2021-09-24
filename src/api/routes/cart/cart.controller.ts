//replace cart, Cart, ICart
import { Request, Response } from 'express';
import { CallbackError } from 'mongoose';
import ICart, { ICartNotPopulated } from '../../interfaces/cart.interface';
import Cart from '../../models/cart.model';

export default class cartController {

    static getCartById(req: Request, res: Response) {
        Cart.findOne({ _id: req.params.id }, (err: CallbackError | null, cart: ICart | null) => {
            if (!cart || err) { return res.status(500).json({ err: 'An Error occured' }); }
            res.json(cart);
        })
    };

    static createCart(req: Request, res: Response) {
        Cart.create({tickets: []}, (err: CallbackError | null, cart: ICartNotPopulated | null) => {
            if (err || !cart) { return res.status(400).json({ err: 'An Error occured' }); }
            res.json(cart);
        });
    }

    static checkOutCartBook(req: Request, res: Response) {
        // implement
    }

    static checkOutCartBookWithLogin(req: Request, res: Response) {
        //implement
    }

    static checkOutCartReserveWithLogin(req: Request, res: Response) {
        //implement
    }

}