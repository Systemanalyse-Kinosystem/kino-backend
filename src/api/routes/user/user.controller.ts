import { Request, Response } from "express";
import User from "../../models/user.model";
import IUser from "../../interfaces/user.interface";
import bcrypt from "bcrypt";
import { CallbackError } from "mongoose";
import { IRequestWithUser } from "../../interfaces/jwt.interface";

export default class userController {
    static async getUserList(req: Request, res: Response) {
        User.find({ role: 'user' }, (err: CallbackError | null, user: IUser | null) => {
            if (err) { return res.status(500).json(err) }
            if (!user) { return res.status(500).json({ err: "An Error occured" }); }
            res.json(user);
        })
    };

    static getUserById(req: Request, res: Response) {
        User.find({
            _id: req.params.id,
            role: 'user'
        }, (err: CallbackError | null, user: IUser | null) => {
            if (err || !user) { return res.status(500).json({ err: "An Error occured" }); }
            res.json(user);
        })
    };

    static async createUser(req: Request, res: Response) {

        User.findOne({ email: req.body.email, role: 'user' }, async (err: CallbackError | null, user: IUser | null) => {
            //check if user already exists
            if (err || user) { return res.status(401).json({ err: "An Error occured" }); }

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
                if (err || !user) { return res.status(500).json({ err: "An Error occured" }); }
                res.json(user);
            })
    }

}
