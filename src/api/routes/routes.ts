import express from "express";
import authenticationRouter from "../routes/authentication/authentication.router";
import userRouter from "./user/user.router";
import hallRouter from "./hall/hall.router";
import customerRouter from "./customer/customer.router";
import seatRouter from "./seat/seat.router"
import movieRouter from "./movies/movie.router"
import screeningRouter from "./screening/screening.router";
import ticketRouter from "./ticket/ticket.router";
let router = express.Router();

// define test route
router.use('/user', userRouter);
router.use('/hall', hallRouter);
router.use('/customer', customerRouter);
router.use('/seat', seatRouter);
router.use('/movie', movieRouter);
router.use('/screening', screeningRouter);
router.use('/ticket', ticketRouter);
router.use('/', authenticationRouter);

export default router;