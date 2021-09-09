import { Request, Response } from 'express';
import { CallbackError } from 'mongoose';
import User from "../../models/user.model";
import IUser from "../../interfaces/user.interface";
import bcrypt from 'bcrypt';
import { IRequestWithUser } from '../../interfaces/jwt.interface';

export default class customerController {

    static getCustomerList(req: Request, res: Response) {
        User.find({ role: 'customer' }, (err: CallbackError | null, user: IUser | null) => {
            if (!user || err) { return res.status(500).json({ err: 'An Error occured' }); }
            user.password
            res.json(user);
        })
    };

    static getCustomerById(req: Request, res: Response) {
        User.findOne({ role: 'customer', _id: req.params.id }, (err: CallbackError | null, user: IUser | null) => {
            if (!user || err) { return res.status(500).json({ err: 'An Error occured' }); }
            res.json(user);
        })
    };

    static getLoggedInCustomer(req: Request, res: Response) {

        User.findOne({ role: 'customer', _id: (<IRequestWithUser>req).user.id }, (err: CallbackError | null, user: IUser | null) => {
            if (!user || err) { return res.status(500).json({ err: 'An Error occured' }); }
            res.json(user);
        })
    }

    static createCustomer(req: Request, res: Response) {
        User.findOne({ email: req.body.email, role: 'customer' }, async (err: CallbackError | null, user: IUser | null) => {
            //check if user already exists
            if (err || user) { return res.status(401).json({ err: "An Error occured" }); }

            req.body.password = await bcrypt.hash(req.body.password, 10);
            req.body.role = 'customer';

            User.create(req.body, (err: CallbackError | null, user: IUser | null) => {
                if (err || !user) {
                    return res.status(500).json(err);
                }
                user.password = "";
                res.status(201).json(user);
            });
        });
    }

    static deleteCustomerById(req: Request, res: Response) {
        User.findOneAndDelete({
        }, {}, (err: CallbackError | null, user: IUser | null) => {
            if (err) { return res.status(500).json({ err: 'An Error occured' }); }
            res.status(204).json({});
        });
    }
    static deleteCustomers(req: Request, res: Response) {
        User.deleteMany((err: CallbackError | null, user: IUser | null) => {
            if (err) { return res.status(500).json({ err: 'An Error occured' }) }
            res.status(204).json({});
        });
    }

    static updateCustomerById(req: Request, res: Response) {
        User.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, (err: CallbackError | null, user: IUser | null) => {
            if (!user || err) { return res.status(500).json({ err: 'An Error occured' }); }
            res.json(user);
        });
    }
}