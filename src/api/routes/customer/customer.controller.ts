import { Request, Response } from 'express';
import { CallbackError } from 'mongoose';
import User from "../../models/user.model";
import IUser from "../../interfaces/user.interface";
import bcrypt from 'bcrypt';
import { IRequestWithUser } from '../../interfaces/jwt.interface';

export default class customerController {

    static async getCustomerList(req: Request, res: Response) {
        //build sortOptions and seachOptions
        let sortOptions: any = {};
        if (req.query.orderdir && (parseInt(<string>req.query.orderdir) == 1 || parseInt(<string>req.query.orderdir) == -1)) {
            sortOptions[<string>req.query.orderby] = <string>req.query.orderdir;
        }
        let searchOptions = req.query.search ? { $text: { $search: <string>req.query.search } } : {};

        User.find({ role: 'customer', ...searchOptions }, null, {
            skip: parseInt(<string>req.query.page) * parseInt(<string>req.query.perPage),
            limit: parseInt(<string>req.query.perPage),
            sort: sortOptions
        }, (err: CallbackError | null, users: IUser[] | null) => {
            if (err) { return res.status(500).json(err) }
            if (!users) { return res.status(500).json({ err: "An Error occured" }); }
            res.json(users);
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

    /* see /register in authentication module
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
    */

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

    static updateLoggedInCustomer(req: Request, res: Response) {
        User.findOneAndUpdate({ _id: (<IRequestWithUser>req).user.id }, req.body, { new: true }, (err: CallbackError | null, user: IUser | null) => {
            if (!user || err) { return res.status(500).json({ err: 'An Error occured' }); }
            res.json(user);
        });
    }
}