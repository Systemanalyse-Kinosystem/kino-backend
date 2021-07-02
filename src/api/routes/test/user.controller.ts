import express from "express";
import userModel from "../../models/user.model";

export default class testController {

    static getUserList(req: express.Request, res: express.Response): void {
        userModel.find({}, (err, user) => {
            if (err) { return res.status(500).json(err) }
            res.json(user);
        })
    };

    static getUserById(req: express.Request, res: express.Response): void {
        userModel.find({ id: req.params.id}, (err, user) => {
            if (err) { return res.status(500).json(err) }
            res.json(user);
        })
    };

    static createUser(req: express.Request, res: express.Response): void {

        //TODO Passwort hashen


        userModel.create({
            name: req.body.name,
            email: req.body.email 
        }, (err, user) => {
            if (err) {
                return res.status(500).json(err);
            }
            res.json(user);
        });
    }

}
