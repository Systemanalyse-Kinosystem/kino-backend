import { NextFunction, Response, Request, RequestHandler } from 'express';
import * as jwt from 'jsonwebtoken';
import { IDataStoredInToken } from '../interfaces/jwt.interface';
import User from '../models/user.model';

class authenticationMiddleware {
    static getAuthenticationMiddleware(roles: string[]): RequestHandler {
        return async (req: any, res: Response, next: NextFunction) => {
            const secret = <string>process.env.JWT_SECRET;
            try {
                const verificationResponse = <IDataStoredInToken>jwt.verify(req.headers.auth, secret);
                console.log(verificationResponse);
                const user = await User.findOne({
                    _id: verificationResponse._id,
                    role: { '$in': roles }
                });
                if (user) {
                    req.user = user;
                    next();
                } else {
                    res.status(401).json({ err: "An Error ocurred" });
                }
            } catch (error) {
                res.status(401).json(error);
            }
        }
    }
    static async authUser(req: any, res: Response, next: NextFunction) {
        const secret = <string>process.env.JWT_SECRET;
        try {
            const verificationResponse = <IDataStoredInToken>jwt.verify(req.headers.auth, secret);
            const user = await User.findOne({
                id: verificationResponse._id,
                role: { '$in': ['user', 'admin'] }
            });
            if (user) {
                req.user = user;
                next();
            } else {
                res.status(401).json({ err: "An Error ocurred" });
            }
        } catch (error) {
            res.status(401).json(error);
        }
    }
/*
    static async authCustomer(req: any, res: Response, next: NextFunction) {
        const secret = <string>process.env.JWT_SECRET;
        try {
            const verificationResponse = <IDataStoredInToken>jwt.verify(req.headers.auth, secret);
            const user = await User.findOne({
                id: verificationResponse._id,
            });
            if (user) {
                req.user = user;
                next();
            } else {
                res.status(401).json({ err: "An Error ocurred" });
            }
        } catch (error) {
            res.status(401).json(error);
        }

    }

    static async authAdmin(req: any, res: Response, next: NextFunction) {
        const secret = <string>process.env.JWT_SECRET;
        try {
            const verificationResponse = <IDataStoredInToken>jwt.verify(req.headers.auth, secret);
            const user = await User.findOne({
                id: verificationResponse._id,
                role: 'admin'
            });
            if (user) {
                req.user = user;
                next();
            } else {
                res.status(401).json({ err: "An Error ocurred" });
            }
        } catch (error) {
            res.status(401).json(error);
        }

    }
    */
}


export default authenticationMiddleware;