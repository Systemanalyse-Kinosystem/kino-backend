import { Request, Response } from "express";
import User from "../../models/user.model";
import IUser from "../../interfaces/user.interface";
import bcrypt from "bcrypt";
import { CallbackError } from "mongoose";
import { IRequestWithUser } from "../../interfaces/jwt.interface";

export default class userController {
    static async getUserList(req: Request, res: Response) {
        //build sortOptions and seachOptions
        let sortOptions: any = {};
        let searchOptions = req.query.search ? { $text: { $search: <string>req.query.search } } : {};
        if (req.query.orderdir && (parseInt(<string>req.query.orderdir) == 1 || parseInt(<string>req.query.orderdir) == -1)) {
            sortOptions[<string>req.query.orderby] = <string>req.query.orderdir;
        }
        User.find({ role: 'user', ...searchOptions }, null, {
            skip: parseInt(<string>req.query.page) * parseInt(<string>req.query.perPage),
            limit: parseInt(<string>req.query.perPage),
            sort: sortOptions
        }, (err: CallbackError | null, user: IUser[] | null) => {
            if (err) { return res.status(400).json({ err: "An Error occurred" }); }
            if (!user) { return res.status(500).json({ err: "An Error occurred" }); }
            res.json(user);
        })
    };

    static getUserById(req: Request, res: Response) {
        User.findOne({
            _id: req.params.id,
            role: 'user'
        }, (err: CallbackError | null, user: IUser | null) => {
            if (err) { return res.status(401).json({ err: "An Error occurred" }); }
            if (!user) { return res.status(500).json({ err: "An Error occurred" }); }
            res.json(user);
        })
    };

    static getLoggedInUser(req: Request, res: Response) {
        User.findOne({
            _id: (<IRequestWithUser>req).user.id,
            role: 'user'
        }, (err: CallbackError | null, user: IUser | null) => {
            if (err) { return res.status(401).json({ err: "An Error occurred" }); }
            if (!user) { return res.status(500).json({ err: "An Error occurred" }); }
            res.json(user);
        })
    };

    static async createUser(req: Request, res: Response) {
        User.findOne({ email: req.body.email, role: 'user' }, async (err: CallbackError | null, user: IUser | null) => {
            //check if user already exists
            if (err || user) { return res.status(500).json({ err: "An Error occured" }); }
            req.body.password = await bcrypt.hash(req.body.password, 10);
            req.body.role = 'user';
            User.create(req.body, (err: CallbackError | null, user: IUser | null) => {
                if (err || !user) {
                    return res.status(500).json(err);
                }
                res.status(201).json(user);
            });
        });
    }

    static async createAdmin(req: Request, res: Response) {
        if (req.query.secret = <string>process.env.ADMIN_SECRET) {
            User.findOne({ email: req.body.email, role: 'admin' }, async (err: CallbackError | null, user: IUser | null) => {
                //check if user already exists
                if (err || user) { return res.status(500).json({ err: "An Error occured" }); }
                req.body.password = await bcrypt.hash(req.body.password, 10);
                req.body.role = 'admin';
                User.create(req.body, (err: CallbackError | null, user: IUser | null) => {
                    if (err || !user) {
                        return res.status(500).json(err);
                    }
                    res.status(201).json(user);
                });
            });
        } else {
            res.status(401).json({ err: "An Error occured" });
        }
    }

    static async deleteUserById(req: Request, res: Response) {

        User.findOneAndDelete({
            _id: req.params.id,
            role: 'user'
        }, {}, (err: CallbackError | null, user: IUser | null) => {
            if (err) { return res.status(500).json(err) }
            res.status(204).json({});
        });
    }

    static async updateUserById(req: Request, res: Response) {
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }
        User.findOneAndUpdate(
            {
                _id: req.params.id,
                role: 'user',
            },
            req.body,
            { new: true },
            (err: CallbackError | null, user: IUser | null) => {
                if (err) { return res.status(401).json({ err: "An Error occurred" }); }
                if (!user) { return res.status(500).json({ err: "An Error occurred" }); }
                res.json(user);
            })
    }

    static async deleteUsers(req: Request, res: Response) {
        User.deleteMany({ role: 'user' }, {}, (err: CallbackError | null) => {
            if (err) { return res.status(500).json(err) }
            res.status(204).json({});
        });
    }

    static async updateLoggedInUser(req: Request, res: Response) {
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }
        User.findOneAndUpdate({ _id: (<IRequestWithUser>req).user.id, role: 'user' },
            req.body,
            { new: true },
            (err: CallbackError | null, user: IUser | null) => {
                if (err) { return res.status(401).json({ err: "An Error occurred" }); }
                if (!user) { return res.status(500).json({ err: "An Error occurred" }); }
                res.json(user);
            })
    }
}
