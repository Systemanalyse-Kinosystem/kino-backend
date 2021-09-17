//replace screening, Screening, IScreening
import { Request, Response } from 'express';
import { CallbackError } from 'mongoose';
import Screening from '../../models/screening.model';
import IScreening from '../../interfaces/screening.interface';

export default class screeningController {

    static async getScreeningList(req: Request, res: Response) {
            //build sortOptions and seachOptions
            let sortOptions: any = {};
            sortOptions[<string>req.query.orderby] = <string>req.query.orderdir;
            let searchOptions = req.query.search ? {$text: { $search: <string>req.query.search }} : {};
            let perPage = req.query.perPage ? parseInt(<string>req.query.perPage) : 10;

            Screening.find({...searchOptions },null, {
                skip: parseInt(<string>req.query.page) * perPage,
                limit: perPage,
                sort: sortOptions,
                populate: ['movie', 'hall']
            },(err: CallbackError | null, PlaceHolderSmalls: IScreening[] | null) => {
                if (err) { return res.status(500).json(err) }
                if (!PlaceHolderSmalls) { return res.status(500).json({ err: "An Error occured" }); }
                res.json(PlaceHolderSmalls);
            })
        };

    static getScreeningById(req: Request, res: Response) {
        Screening.findOne({ _id: req.params.id }, null, {populate: ['movie', 'hall']}, (err: CallbackError | null, screening: IScreening | null) => {
            if (!screening || err) { return res.status(500).json({ err: 'An Error occured' }); }
            res.json(screening);
        })
    };
/* DEACTIVATED FOR MVP
    static createScreening(req: Request, res: Response) {
        Screening.create(req.body, (err: CallbackError | null, screening: IScreening | null) => {
            if (err || !screening) { return res.status(400).json({ err: 'An Error occured' }); }
            res.json(screening);
        });
    }

    static deleteScreeningById(req: Request, res: Response) {
        Screening.findOneAndDelete({
        }, {}, (err: CallbackError | null, screening: IScreening | null) => {
            if (err) { return res.status(400).json({ err: 'An Error occured' }); }
            res.status(204).json({});
        });
    }
    static deleteScreenings(req: Request, res: Response) {
        Screening.deleteMany((err: CallbackError | null, screening: IScreening | null) => {
            if (err) { return res.status(500).json({ err: 'An Error occured' }) }
            res.status(204).json({});
        });
    }

    static updateScreeningById(req: Request, res: Response) {
        Screening.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, (err: CallbackError | null, screening: IScreening | null) => {
            if (!screening || err) { return res.status(500).json({ err: 'An Error occured' }); }
            res.json(screening);
        });
    }
    */
}