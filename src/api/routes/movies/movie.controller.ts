//replace movie, Movie, IMovie
import { Request, Response } from 'express';
import { CallbackError } from 'mongoose';
import Movie from '../../models/movie.model'

export default class movieController {

    static async getMovieList(req: Request, res: Response) {
        //build sortOptions and seachOptions
        let sortOptions: any = {};
        sortOptions[<string>req.query.orderby] = <string>req.query.orderdir;
        let searchOptions = req.query.search ? { $text: { $search: "\"" + <string>req.query.search + "\"" } } : {};
        let perPage = req.query.perPage ? parseInt(<string>req.query.perPage) : 10;

        Movie.find({ ...searchOptions }, null, {
            skip: parseInt(<string>req.query.page) * perPage,
            limit: perPage,
            sort: sortOptions
        }, (err: CallbackError | null, movies: any) => {
            if (err) { return res.status(400).json(err) }
            if (!movies) { return res.status(500).json({ err: err ? err : "Not found" }); }
            Movie.count(searchOptions, (err: CallbackError | null, count: number | null) => {
                res.json({ movies: movies, count: count });
            });
        });
    };

    static getMovieById(req: Request, res: Response) {
        Movie.findOne({ _id: req.params.id }, (err: CallbackError | null, movie: any) => {
            if (!movie || err) { return res.status(500).json({ err: err ? err : "Not found" }); }
            res.json(movie);
        });
    };


}