import {Request, Response} from "express";
import userModel from "../../models/user.model";
import IUser from "../../interfaces/user.interface";
import bcrypt from "bcrypt";
import { IDataStoredInToken, ITokenData, IRequestWithUser } from "../../interfaces/jwt.interface";
import jwt from "jsonwebtoken";

export default class testController {

    static async getUserList(req: Request, res: Response) {
        console.log((<IRequestWithUser>req).user);
        userModel.find({}, (err, user) => {
            if (err) { return res.status(500).json(err) }
            if(!user) { return res.status(500).json({ err: "An Error occurred" });}
            res.json(user);
        })
    };

    static getUserById(req: Request, res: Response) {
        userModel.find({ id: req.params.id }, (err, user) => {
            if (err) { return res.status(500).json(err) }
            if(!user) { return res.status(500).json({ err: "An Error occurred" });}
            res.json(user);
        })
    };

    static async createUser(req: Request, res: Response) {

        userModel.findOne({ email: req.body.email }, async (err: Error, user: IUser) => {
            if (err) { return res.status(401).json({ err: "An Error occurred" }); }
            //if user already exists, send error 
            if (user) { return res.status(401).json({ err: "An Error occurred" });}

            req.body.password = await bcrypt.hash(req.body.password, 10);

            userModel.create(req.body, (err: Error, user: IUser) => {
                if (err) {
                    return res.status(500).json(err);
                }
                user.password = "";
                res.json(user);
            });
        });
    }

    static async login(req: Request, res: Response) {
        userModel.findOne({ email: req.body.email }, async (err: Error, user: IUser) => {
            if (err) { return res.status(401).json({ err: "An Error occurred" }); }
            if(!user) { return res.status(500).json({ err: "An Error occurred" });}
            if(await bcrypt.compare(req.body.password, user.password)) {
                user.password = "";
                res.json({ 
                    email: user.email,
                    token: testController.createToken(user)
                });
                
            }
        });  
    }

    private static createToken(user: IUser): ITokenData {
        const expiresIn = 1; 
        const secret = <string>process.env.JWT_SECRET;
        const dataStoredInToken: IDataStoredInToken = {
          _id: user._id,
        };
        return {
          expiresIn,
          token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
        };
      }

}
