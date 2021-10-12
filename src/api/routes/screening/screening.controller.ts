//replace screening, Screening, IScreening
import { Request, Response } from 'express';
import { CallbackError } from 'mongoose';
import Screening from '../../models/screening.model';
import IScreening from '../../interfaces/screening.interface';
import Ticket from '../../models/ticket.model';

export default class screeningController {

    static async getScreeningList(req: Request, res: Response) {
        try {
            //build queryOptions
            let sortOptions: any = {};
            sortOptions[<string>req.query.orderby] = <string>req.query.orderdir;
            let perPage = req.query.perPage ? parseInt(<string>req.query.perPage) : 10;
            let dateFilter = req.query.dateBegin && req.query.dateEnd ? { startDate: { $gte: new Date(<string>req.query.dateBegin), $lt: new Date(<string>req.query.dateEnd) } } : {};
            let movieFilter = req.query.movie ? { movie: <string>req.query.movie } : {};
            let queryOptions = {
                skip: parseInt(<string>req.query.page) * perPage,
                limit: perPage,
                sort: sortOptions,
                populate: 'movie'
            };

            let screenings = await Screening.find({ ...movieFilter, ...dateFilter }, null, queryOptions);
            if (!screenings) { return res.status(500).json({ err: "Not found" }); }

            //add free Seat Count
            let screeningsWithCount: any = []
            for (let i = 0; i < screenings.length; i++) {
                let freeSeats = await Ticket.countDocuments({ screening: screenings[i]._id, status: "available" });
                screeningsWithCount.push({ ...screenings[i].toObject(), freeSeats });
            }

            res.json(screeningsWithCount);
        } catch (e) { res.status(500).json({ err: 'An Error occured' }); console.log(e) }
    };

    static async getScreeningById(req: Request, res: Response) {
        try {
            let screening = await Screening.findOne({ _id: req.params.id }, null, { populate: 'movie' });
            if (!screening) { return res.status(500).json({ err: "Not found" }); }

            let freeSeats = await Ticket.countDocuments({ screening: screening._id, status: "available" });
            let screeningWithCount = { ...screening.toObject(), freeSeats };

            res.json(screeningWithCount);
        } catch (e) { res.status(500).json({ err: 'An Error occured' }); }

    };

    static async getScreeningByMovieId(req: Request, res: Response) {
        //build sortOptions and seachOptions
        try {
            let sortOptions: any = {};
            sortOptions[<string>req.query.orderby] = <string>req.query.orderdir;
            let perPage = req.query.perPage ? parseInt(<string>req.query.perPage) : 10;
            let queryOptions = {
                skip: parseInt(<string>req.query.page) * perPage,
                limit: perPage,
                sort: sortOptions,
                populate: 'movie'
            };
            let screenings = await Screening.find({ movie: req.params.id }, null, queryOptions);

            if (!screenings) { return res.status(500).json({ err: "Not found" }); }

            //add free Seat Count
            let screeningsWithCount: any = []
            for (let i = 0; i < screenings.length; i++) {
                let freeSeats = await Ticket.countDocuments({ screening: screenings[i]._id, status: "available" });
                screeningsWithCount.push({ ...screenings[i].toObject(), freeSeats });
            }
            res.json(screeningsWithCount);
        } catch (e) { res.status(500).json({ err: 'An Error occured' }); }
    };

    /* DEACTIVATED FOR MVP
    static createScreening(req: Request, res: Response) {
        Screening.create(req.body, (err: CallbackError | null, screening: IScreening | null) => {
            if (err || !screening) { return res.status(400).json({ err: err ? err : "Not found" }); }

            let ticketBodies: any = [];
            for (let i = 1; i < screening.hall.rows + 1; i++) {
                for (let j = 1; j < screening.hall.seatsPerRow + 1; j++) {
                    ticketBodies.push({
                        screening: screening._id,
                        status: 'available',
                        seat: {
                            rowNumber: i,
                            colNumber: j,
                            type: i <= screening.hall.rows * 0.3 ? "box" : "parquet"
                        }
                    })
                }
            }

            Ticket.insertMany(ticketBodies, {}, (err: CallbackError, result: any) => {
                if (err) {
                    return res.status(500).json({ err: "An Error occurred (Seatcreation)" });
                }
                res.status(201).json(screening);
            });

        });
    }

    static deleteScreeningById(req: Request, res: Response) {
        Screening.findOneAndDelete({
        }, {}, (err: CallbackError | null, screening: IScreening | null) => {
            if (err) { return res.status(400).json({ err: err?err:"Not found" }); }
            res.status(204).json({});
        });
    }
    static deleteScreenings(req: Request, res: Response) {
        Screening.deleteMany((err: CallbackError | null, screening: IScreening | null) => {
            if (err) { return res.status(500).json({ err: err?err:"Not found" }); }
            res.status(204).json({});
        });
    }
 
    static updateScreeningById(req: Request, res: Response) {
        Screening.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, (err: CallbackError | null, screening: IScreening | null) => {
            if (!screening || err) { return res.status(500).json({ err: err?err:"Not found" }); }
            res.json(screening);
        });
    }
    */
}