//replace movie, Movie, IMovie
import { Request, Response } from 'express';
import { CallbackError } from 'mongoose';
import Movie from '../../models/movie.model'

export default class movieController {

    static getMovieList(req: Request, res: Response) {
        Movie.find({}, (err: CallbackError | null, movies: any) => {
            if (!movies || err) { return res.status(500).json({ err: 'An Error occured' }); }
            res.json(movies);
        })
    };

    static getMovieById(req: Request, res: Response) {
        Movie.findOne({ _id: req.params.id }, (err: CallbackError | null, movie:any) => {
            if (!movie || err) { return res.status(500).json({ err: 'An Error occured' }); }
            res.json(movie);
        })
    };


}