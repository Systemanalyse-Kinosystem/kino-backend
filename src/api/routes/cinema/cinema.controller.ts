import { Request, Response } from "express";
import Cinema from "../../models/cinema.model";
import ICinema from "../../interfaces/cinema.interface";
import User from "../../models/user.model"
import IUser from "../../interfaces/user.interface"
import bcrypt from "bcrypt";
import { CallbackError } from "mongoose";
import { createNoSubstitutionTemplateLiteral } from "typescript";

export default class cinemaController {

    static async getCinemaList(req: Request, res: Response) {
        Cinema.find((err: CallbackError | null, cinema: ICinema | null) => {
            if (!cinema || err) { return res.status(500).json({ err: "An Error occured" }); }
            res.json(cinema);
        })
    };

    static getCinemaById(req: Request, res: Response) {
        Cinema.findById(req.params.id, (err: CallbackError | null, cinema: ICinema | null) => {
            if (!cinema || err) { return res.status(500).json({ err: "An Error occured" }); }
            res.json(cinema);
        })
    };

    static async createCinema(req: Request, res: Response) {
          
        User.findOne({ email: req.body.adminMail }, async (err: CallbackError | null, user: IUser | null) => {
            if (err || user) { return res.status(401).json({ err: "An Error occured" }); }

            let password = await bcrypt.hash('test1234', 10);

            Cinema.create(req.body, (err: CallbackError | null, cinema: ICinema | null) => {
                if (err || !cinema) {
                    return res.status(500).json(err);
                }
                User.create({
                    name: 'admin',
                    email: req.body.adminMail,
                    password: password,
                    role: 'admin',
                    cinema: cinema._id
                }, (err: CallbackError | null, user: IUser | null) => {
                    if (err || !user) {
                        return res.status(500).json(err);
                    }
                    res.status(201).json({
                        cinema: cinema,
                        email: user.email,
                        password: 'test1234'
                    });
                });
            });
        });
    }

    static async deleteCinemaById(req: Request, res: Response) {
        Cinema.findOneAndDelete({
            _id: req.params.id
        }, {}, (err: CallbackError | null, cinema: ICinema | null) => {
            if (err) { return res.status(500).json(err) }
            res.status(204).json({});
        });
    }

    static async deleteCinemas(req: Request, res: Response) {
        Cinema.deleteMany((err: CallbackError | null, cinema: ICinema | null) => {
            if (err) { return res.status(500).json(err) }
            res.status(204).json({});
        });
    }

    static async updateCinemaById(req: Request, res: Response) {
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }
        Cinema.findOneAndUpdate(
            {
                _id: req.params.id
            },
            req.body,
            { new: true },
            (err: CallbackError | null, cinema: ICinema | null) => {
                if (!cinema || err) { return res.status(500).json({ err: "An Error occured" }); }
                res.json(cinema);
            })
    }

}
