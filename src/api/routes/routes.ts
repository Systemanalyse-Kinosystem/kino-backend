import express from "express";
import userRouter from "./user/user.router";
let router = express.Router();

// define test route
router.use('/user', userRouter);

export default router;