import express from "express";
import authenticationRouter from "../routes/authentication/authentication.router";
import userRouter from "./user/user.router";
import customerRouter from "./customer/customer.router";
import movieRouter from "./movies/movie.router"
import screeningRouter from "./screening/screening.router";
import ticketRouter from "./ticket/ticket.router";
import cartRouter from "./cart/cart.router";
let router = express.Router();

// define test route
router.use('/user', userRouter);
router.use('/customer', customerRouter);
router.use('/movie', movieRouter);
router.use('/screening', screeningRouter);
router.use('/ticket', ticketRouter);
router.use('/cart', cartRouter);
router.use('/', authenticationRouter);

export default router;