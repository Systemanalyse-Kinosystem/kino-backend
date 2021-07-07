import { Request, Response } from "express";
import userModel from "../../models/user.model";
import IUser from "../../interfaces/user.interface";
import bcrypt from "bcrypt";
import { IDataStoredInToken, ITokenData, IRequestWithUser } from "../../interfaces/jwt.interface";
import jwt from "jsonwebtoken";

export default class testController {
    static async login(req: Request, res: Response) {
        userModel.findOne({ email: req.body.email }, async (err: Error, user: IUser) => {
            if (err) { return res.status(401).json({ err: "An Error occurred" }); }
            if (!user) { return res.status(500).json({ err: "An Error occurred" }); }
            if (await bcrypt.compare(req.body.password, user.password)) {
                user.password = "";
                res.json({
                    email: user.email,
                    token: testController.createToken(user)
                });

            }
        });
    }

    private static createToken(user: IUser): ITokenData {
        const expiresIn = 60 * 60;
        const secret = <string>process.env.JWT_SECRET;
        const dataStoredInToken: IDataStoredInToken = {
            _id: user._id
        };
        return {
            expiresIn,
            token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
        };
    }

    static registerCustomer(req: Request, res: Response) {

        userModel.findOne({ email: req.body.email }, async (err: Error, user: IUser) => {
            if (err) { return res.status(401).json({ err: "An Error occurred" }); }
            //if user already exists, send error 
            if (user) { return res.status(401).json({ err: "An Error occurred" }); }

            req.body.password = await bcrypt.hash(req.body.password, 10);

            userModel.create({
                ...req.body,
                role: 'customer'
            }, (err: Error, user: IUser) => {
                if (err) {
                    return res.status(500).json(err);
                }
                user.password = "";
                res.json(user);
            });
        });
    }

    static isAuthenticated(req: Request, res: Response) {
        res.json({
            isAuthenticated: true
        });
    }
}