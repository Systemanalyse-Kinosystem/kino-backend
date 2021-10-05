import { Request, Response } from 'express';
import User from "../../models/user.model";
import { IRequestWithUser } from '../../interfaces/jwt.interface';

export default class customerController {

    static async getCustomerList(req: Request, res: Response) {
        //build sortOptions and seachOptions
        try {
            let sortOptions: any = {};
            if (req.query.orderdir && (parseInt(<string>req.query.orderdir) == 1 || parseInt(<string>req.query.orderdir) == -1)) {
                sortOptions[<string>req.query.orderby] = <string>req.query.orderdir;
            }
            let filterOptions: any = req.query.search ? { $text: { $search: <string>req.query.search } } : {};
            filterOptions.role = "customer";
            let queryOptions = {
                skip: parseInt(<string>req.query.page) * parseInt(<string>req.query.perPage),
                limit: parseInt(<string>req.query.perPage),
                sort: sortOptions
            };
            let users = await User.find(filterOptions, null, queryOptions);

            if (!users) { return res.status(500).json({ err: "An Error occured" }); }
            res.json(users);
        } catch (e) { res.status(500).json({ err: 'An Error occured' }); }

    };

    static async getCustomerById(req: Request, res: Response) {
        try {
            let user = await User.findOne({ role: 'customer', _id: req.params.id });
            if (!user) { return res.status(500).json({ err: 'An Error occured' }); }
            res.json(user);
        } catch (e) { res.status(500).json({ err: 'An Error occured' }); }
    };

    static async getLoggedInCustomer(req: Request, res: Response) {
        try {
            let user = await User.findOne({ role: 'customer', _id: (<IRequestWithUser>req).user.id });
            if (!user) { return res.status(500).json({ err: 'An Error occured' }); }
            res.json(user);
        } catch (e) { res.status(500).json({ err: 'An Error occured' }); }
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

    static async deleteCustomerById(req: Request, res: Response) {
        try {
            await User.findOneAndDelete({ role: 'customer', _id: req.params.id });
            res.status(204).json({});
        } catch (e) { res.status(500).json({ err: 'An Error occured' }); }

    }
    static async deleteCustomers(req: Request, res: Response) {
        try {
            await User.deleteMany({ role: 'customer' });
            res.status(204).json({});
        } catch (e) { res.status(500).json({ err: 'An Error occured' }); }
    }

    static async updateCustomerById(req: Request, res: Response) {
        try {
            let user = await User.findOneAndUpdate({ role: 'customer', _id: req.params.id }, req.body, { new: true });
            if (!user) { return res.status(500).json({ err: 'An Error occured' }); }
            res.json(user);
        } catch (e) { res.status(500).json({ err: 'An Error occured' }); }
    }

    static async updateLoggedInCustomer(req: Request, res: Response) {
        try {
            let user = await User.findOneAndUpdate({ _id: (<IRequestWithUser>req).user.id, role: 'customer' }, req.body, { new: true });
            if (!user) { return res.status(500).json({ err: 'An Error occured' }); }
            res.json(user);
        } catch (e) { res.status(500).json({ err: 'An Error occured' }); }
    }
}