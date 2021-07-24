import express from "express";
import authenticationRouter from "../routes/authentication/authentication.router";
import userRouter from "./user/user.router";
import cinemaRouter from "./cinema/cinema.router";
let router = express.Router();

// define test route
router.use('/user', userRouter);
router.use('/cinema', cinemaRouter)
router.use('/', authenticationRouter);

export default router;