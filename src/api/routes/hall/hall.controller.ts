import { Request, Response } from "express";
import Hall from "../../models/hall.model";
import IHall from "../../interfaces/hall.interface";
import { CallbackError, InsertManyResult } from "mongoose";
import ISeat from "../../interfaces/seat.interface";
import Seat from "../../models/seat.model";

export default class hallController {
 /* DEACTIVATED FOR MVP
    static async getHallList(req: Request, res: Response) {
        //build sortOptions and seachOptions
        let sortOptions: any = {};
        if (req.query.orderdir && (parseInt(<string>req.query.orderdir) == 1 || parseInt(<string>req.query.orderdir) == -1)) {
            sortOptions[<string>req.query.orderby] = <string>req.query.orderdir;
        }
        let searchOptions = req.query.search ? { $text: { $search: <string>req.query.search } } : {};
        Hall.find({ ...searchOptions }, null, {
            skip: parseInt(<string>req.query.page) * parseInt(<string>req.query.perPage),
            limit: parseInt(<string>req.query.perPage),
            sort: sortOptions,
            populate: <string>req.query.populate

        }, (err: CallbackError | null, halls: IHall[] | null) => {
            if (err) { return res.status(500).json(err) }
            if (!halls) { return res.status(500).json({ err: "An Error occured" }); }
            res.json(halls);
        })
    };

    static getHallById(req: Request, res: Response) {
        Hall.findOne({ _id: req.params.id }, (err: CallbackError | null, hall: IHall | null) => {
            if (!hall || err) { return res.status(500).json({ err: "An Error occured" }); }
            res.json(hall);
        })
    };
   
    static createHall(req: Request, res: Response) {
        Hall.create(req.body, (err: CallbackError | null, hall: IHall | null) => {
            if (err || !hall) {
                return res.status(500).json(err);
            }
            let rows = req.query.rows ? parseInt(<string>req.query.rows) + 1 : 11;
            let cols = req.query.cols ? parseInt(<string>req.query.cols) + 1 : 11;
            let parquetLimit = req.query.parquet ? parseInt(<string>req.query.parquet) : 8;
            let seats: any[] = [];
            for (let i = 1; i < rows; i++) {
                for (let j = 1; j < cols; j++) {
                    seats = seats.concat([{
                        rowNumber: i,
                        colNumber: j,
                        type: i < parquetLimit ? "parquet" : "box"
                    }])
                }
            }
            Seat.insertMany(seats,{}, (err: CallbackError | null, result:any) => {
                if(err) {
                    return res.status(500).json({err: "An Error occurred (Seatcreation)"})
                }
                
                Hall.findByIdAndUpdate(hall._id, {seats: result}, {new: true}, (err: CallbackError, hall) => {
                    if (!hall || err) { return res.status(500).json({ err: "An Error occured" }); }
                    res.json(hall)
                })
                
            })
        });
    }

    static async deleteHallById(req: Request, res: Response) {
        Hall.findOneAndDelete({ _id: req.params.id }, {}, (err: CallbackError | null, hall: IHall | null) => {
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
        Hall.findOneAndUpdate({ _id: req.params.id },
            req.body,
            { new: true },
            (err: CallbackError | null, hall: IHall | null) => {
                if (!hall || err) { return res.status(500).json({ err: "An Error occured" }); }
                res.json(hall);
            })
    }
    */ 


}
