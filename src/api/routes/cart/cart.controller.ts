import { Request, Response } from 'express';
import Cart from '../../models/cart.model';
import Ticket from '../../models/ticket.model';
import { IRequestWithUser } from '../../interfaces/jwt.interface';
import User from "../../models/user.model";
import utils from "../../utils/utils";

export default class cartController {

    static async getCartById(req: Request, res: Response) {
        try {
            let cart = await Cart.findOne({ _id: req.params.id }).populate([{
                path: 'tickets',
                populate: {
                    path: 'screening',
                    model: 'screenings',
                    populate: {
                        path: 'movie',
                        model: 'movies'
                    }
                }
            }]);
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
            if(!(req.body.firstName && req.body.lastName && req.body.email)) {
                return res.status(400).json({err: "firstName, lastName or email missing"});
            }
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


        static async checkOutCartBookWithLogin(req: Request, res: Response) {
            try {
                let cart = await Cart.findById(req.params.id);
                if (!cart) { return res.status(400).json({ err: "Cart not found" }); }
    
                await Ticket.updateMany({ _id: { $in: cart.tickets } }, { "$set": { status: "valid", userID: (<IRequestWithUser>req).user.id } }, { "multi": true });
    
                let cartUpdated = await Cart.findOneAndUpdate({ _id: req.params.id }, { tickets: [] }, { new: true });
                if (!cartUpdated) { return res.status(400).json({ err: "Not found" }); }
                
                let user = await User.findOne({_id:  (<IRequestWithUser>req).user.id});
                if(!user) {
                    return res.status(500).json({err: "An error ocurreddd"});
                }

                res.json(cartUpdated);
    
                //send Mail
                utils.sendBookingEmail(user.email, cart.tickets)
            } catch (e) { res.status(500).json(e); }
        }
    

    static async checkOutCartReserveWithLogin(req: Request, res: Response) {
        try {

            let cart = await Cart.findById(req.params.id);
            if (!cart) { return res.status(400).json({ err: "Cart not found" }); }

            await Ticket.updateMany({ _id: { $in: cart.tickets } }, { "$set": { status: "reserved", userID: (<IRequestWithUser>req).user.id } }, { "multi": true });

            let updatedCart = await Cart.findOneAndUpdate({ _id: req.params.id }, { tickets: [] }, { new: true });
            if (!updatedCart) { return res.status(400).json({ err: "Not found" }); }

            let user = await User.findOne({_id:  (<IRequestWithUser>req).user.id});
                if(!user) {
                    return res.status(500).json({err: "An error ocurreddd"});
                }

            utils.sendReservationEmail(user.email, cart.tickets);
            
            
            res.json(updatedCart);
            
        } catch (e) { res.status(500).json(e); }
    }

      static async checkOutCartReserveWithoutLogin(req: Request, res: Response) {
        try {
            if(!(req.body.firstName && req.body.lastName && req.body.email)) {
                return res.status(400).json({err: "firstName, lastName or email missing"});
            }
            let cart = await Cart.findById(req.params.id);
            if (!cart) { return res.status(400).json({ err: "Cart not found" }); }
            
            //tickets get mapped to the predefined user for paying in the cinema
            await Ticket.updateMany({ _id: { $in: cart.tickets } }, { "$set": { status: "reserved", user: req.body, userID: '617e82ba6f9ea500136f0976' } }, { "multi": true });

            let cartUpdated = await Cart.findOneAndUpdate({ _id: req.params.id }, { tickets: [] }, { new: true });
            if (!cartUpdated) { return res.status(400).json({ err: "Not found" }); }

            res.json(cartUpdated);

            //send Mail
            utils.sendReservationEmail(req.body.email, cart.tickets)
        } catch (e) { res.status(500).json(e); }
    }
}