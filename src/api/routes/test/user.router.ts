import express from "express";
import userController from "./user.controller";
let router = express.Router();

// define test route
router.get('/', userController.getUserList);
router.get('/:id', userController.getUserById)
router.post('/', userController.createUser);

export default router;