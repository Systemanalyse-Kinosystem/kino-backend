import { Request, Response } from "express";
import Hall from "../../models/hall.model";
import IHall from "../../interfaces/hall.interface";
import { CallbackError } from "mongoose";

export default class hallController {

    static async getHallList(req: Request, res: Response) {
            //build sortOptions and seachOptions
            let sortOptions: any = {};
            sortOptions[<string>req.query.orderby] = <string>req.query.orderdir;
            let searchOptions = req.query.search ? {$text: { $search: <string>req.query.search }} : {};
    
            Hall.find({...searchOptions },null, {
                skip: parseInt(<string>req.query.page) * parseInt(<string>req.query.perPage),
                limit: parseInt(<string>req.query.perPage),
                sort: sortOptions
            },(err: CallbackError | null, halls: IHall[] | null) => {
                if (err) { return res.status(500).json(err) }
                if (!halls) { return res.status(500).json({ err: "An Error occured" }); }
                res.json(halls);
            })
        };

    static getHallById(req: Request, res: Response) {
        Hall.findOne({_id: req.params.id}, (err: CallbackError | null, hall: IHall | null) => {
            if (!hall || err) { return res.status(500).json({ err: "An Error occured" }); }
            res.json(hall);
        })
    };

    static createHall(req: Request, res: Response) {
        Hall.create(req.body, (err: CallbackError | null, hall: IHall | null) => {
            if (err || !hall) {
                return res.status(500).json(err);
            }
            res.json(hall);
        });
    }

    static async deleteHallById(req: Request, res: Response) {
        Hall.findOneAndDelete({_id: req.params.id}, {}, (err: CallbackError | null, hall: IHall | null) => {
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
        Hall.findOneAndUpdate({_id: req.params.id},
            req.body,
            { new: true },
            (err: CallbackError | null, hall: IHall | null) => {
                if (!hall || err) { return res.status(500).json({ err: "An Error occured" }); }
                res.json(hall);
            })
    }

}
