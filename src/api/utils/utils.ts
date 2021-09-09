import IUser from "../interfaces/user.interface"
import { ITokenData, IDataStoredInToken } from "../interfaces/jwt.interface"
import jwt from "jsonwebtoken";

export default class UtilClass {
    
    static createToken(user: IUser): ITokenData {
        const expiresIn = 60 * 60 * 4;
        const secret = <string>process.env.JWT_SECRET;
        const dataStoredInToken: IDataStoredInToken = {
            _id: user._id
        };
        return {
            expiresIn,
            token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
        };
    }

}