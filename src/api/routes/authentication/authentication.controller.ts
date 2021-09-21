import { Request, Response } from "express";
import User from "../../models/user.model";
import IUser from "../../interfaces/user.interface";
import bcrypt from "bcrypt";
import { IDataStoredInToken, ITokenData, IRequestWithUser } from "../../interfaces/jwt.interface";
import jwt from "jsonwebtoken";
import utils from "../../utils/utils"
import { CallbackError } from "mongoose";

export default class AuthenticationController {
    static async login(req: Request, res: Response) {
        User.findOne({ email: req.body.email },"+password", {}, async (err: CallbackError | null, user: IUser | null) => {
            if (err) { return res.status(401).json({ err: "An Error occurred" });  }
            if (!user) { return res.status(500).json({ err: "An Error occurred" }); }
            if (await bcrypt.compare(req.body.password, user.password)) {
                return res.json({
                    email: user.email,
                    token: utils.createToken(user)
                });
            }
            return res.status(401).json({err: "An Error occurred"});
        });
    }

    static registerCustomer(req: Request, res: Response) {

        User.findOne({ email: req.body.email }, async (err: CallbackError | null, user: IUser | null) => {
            //check if user with this email already exists
            if (err || user) { return res.status(401).json({ err: "An CallbackError occurred" }); }

            req.body.password = await bcrypt.hash(req.body.password, 10);
            req.body.role = 'customer';
            User.create(req.body, (err: CallbackError | null, user: IUser | null) => {
                if (err || !user) {
                    return res.status(400).json(err);
                }
                user.password = "";
                res.status(201).json(user);
            });
        });
    }
    /*
        static isAuthenticated(req: Request, res: Response) {
            res.json({
                isAuthenticated: true
            });
        }
        */
}