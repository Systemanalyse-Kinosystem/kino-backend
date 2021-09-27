//replace Movie, movie
import express from "express";
import movieController from "./movie.controller"

let router = express.Router();

router.get('/', movieController.getMovieList);
router.get('/:id', movieController.getMovieById);


export default router;