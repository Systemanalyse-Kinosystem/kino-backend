//replace movie, Movie, IMovie
import { query, Request, Response } from 'express';
import { CallbackError } from 'mongoose';
import Movie from '../../models/movie.model'

export default class movieController {

    static async getMovieList(req: Request, res: Response) {
        try {
            let sortOptions: any = {};
            sortOptions[<string>req.query.orderby] = <string>req.query.orderdir;
            let perPage = req.query.perPage ? parseInt(<string>req.query.perPage) : 10;
            let queryOptions = {
                skip: parseInt(<string>req.query.page) * perPage,
                limit: perPage,
                sort: sortOptions
            };

            let filterOptions = req.query.search ? { $text: { $search: "\"" + <string>req.query.search + "\"" } } : {};

            let movies = await Movie.find(filterOptions, null, queryOptions);
            if (!movies) { return res.status(500).json({ err: "Not found" }); }

            let count = await Movie.count(filterOptions);
            res.json({ movies: movies, count: count });

        } catch (e) { res.status(500).json(e); }
    };

    static async getMovieById(req: Request, res: Response) {
        try {
            let movie = await Movie.findOne({ _id: req.params.id });
            if (!movie) { return res.status(500).json({ err: "Not found" }); }
            res.json(movie);

        } catch (e) { res.status(500).json(e); }
    };


}