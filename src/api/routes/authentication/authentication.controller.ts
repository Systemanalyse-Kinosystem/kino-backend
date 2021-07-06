import { NextFunction, Response, Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { IRequestWithUser, IDataStoredInToken, ITokenData } from './../../interfaces/jwt.interface';
import User from './../../models/user.model';

  class authenticationController {
static async authUser(req: any, res: Response, next: NextFunction) {
    const secret = <string>process.env.JWT_SECRET;

    try {   
        const verificationResponse = <IDataStoredInToken>jwt.verify(req.headers.auth, secret);
        const user = await User.findById(verificationResponse._id);
        if (user) {
            req.user = user;
            next();
        } else {
            res.status(401).json({err: "An Error ocurred"});
        }
    } catch (error) {
        res.status(401).json(error);
    }
    
} 
}


export default authenticationController;