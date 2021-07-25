import express from "express";
import cinemaController from "./cinema.controller";
import authenticationMiddleware from "../../middlewares/auth.middlewares";

let router = express.Router();

// define test route
router.get('/', authenticationMiddleware.getAuthenticationMiddleware(['sysadmin']), cinemaController.getCinemaList );
router.get('/:id', authenticationMiddleware.getAuthenticationMiddleware(['sysadmin']), cinemaController.getCinemaById);
router.post('/', cinemaController.createCinema);
router.put('/:id', authenticationMiddleware.getAuthenticationMiddleware(['admin']), cinemaController.updateCinemaById);
router.delete('/:id', authenticationMiddleware.getAuthenticationMiddleware(['sysadmin']), cinemaController.deleteCinemaById);
//router.delete('/', authenticationMiddleware.getAuthenticationMiddleware(['sysadmin']), cinemaController.deleteCinemas);

export default router;