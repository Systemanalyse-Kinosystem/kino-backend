import express from "express";
import authenticationRouter from "../routes/authentication/authentication.router";
import userRouter from "./user/user.router";
//import cinemaRouter from "./z_old_cinema/cinema.router";
import hallRouter from "./hall/hall.router";
let router = express.Router();

// define test route
router.use('/user', userRouter);
//router.use('/cinema', cinemaRouter);
router.use('/hall', hallRouter);
router.use('/', authenticationRouter);

export default router;