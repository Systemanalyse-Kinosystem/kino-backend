import express from "express";
import authenticationRouter from "../routes/authentication/authentication.router";
import userRouter from "./user/user.router";
let router = express.Router();

// define test route
router.use('/user', userRouter);
router.use('/', authenticationRouter);

export default router;