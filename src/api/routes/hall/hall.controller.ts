import { Request, Response } from "express";
import Hall from "../../models/hall.model";
import IHall from "../../interfaces/hall.interface";
import {IRequestWithUser} from "../../interfaces/jwt.interface"
import { CallbackError } from "mongoose";

export default class hallController {

    static getHallList(req: Request, res: Response) {
        Hall.find({
            cinema: (<IRequestWithUser>req).user.cinema
        }, (err: CallbackError, hall: IHall | null) => {
            if (err) { return res.status(500).json(err) }
            if (!hall) { return res.status(500).json({ err: "An Error occured" }); }
            res.json(hall);
        })
    };

    static getHallById(req: Request, res: Response) {
        Hall.findOne({
            _id: req.params.id,
            cinema: (<IRequestWithUser>req).user.cinema
        }, (err: CallbackError, hall: IHall | null) => {
            if (err) { return res.status(500).json(err) }
            if (!hall) { return res.status(500).json({ err: "An Error occured" }); }
            res.json(hall);
        })
    };

    static createHall(req: Request, res: Response) {
        Hall.create({
            ...req.body,
            cinema: (<IRequestWithUser>req).user.cinema
        }, (err: CallbackError, hall: IHall) => {
            if (err) {
                return res.status(500).json(err);
            }
            res.json(hall);
        });
    }

    static async deleteHallById(req: Request, res: Response) {
        Hall.findOneAndDelete({
            _id: req.params.id,
            cinema: (<IRequestWithUser>req).user.cinema
        }, {}, (err: CallbackError | null, hall: IHall | null) => {
            if (err) { return res.status(500).json(err) }
            res.status(204).json({});
        });
    }

    static async deleteHalls(req: Request, res: Response) {
        Hall.deleteMany((err: CallbackError | null, hall: IHall | null) => {
            if (err) { return res.status(500).json(err) }
            res.status(204).json({});
        });
    }

    static async updateHallById(req: Request, res: Response) {
        Hall.findOneAndUpdate(
            {
                _id: req.params.id,
                cinema: (<IRequestWithUser>req).user.cinema
            },
            req.body,
            { new: true },
            (err: CallbackError, hall: IHall | null) => {
                if (err) { return res.status(500).json(err) }
                if (!hall) { return res.status(500).json({ err: "An Error occured" }); }
                res.json(hall);
            })
    }

}
