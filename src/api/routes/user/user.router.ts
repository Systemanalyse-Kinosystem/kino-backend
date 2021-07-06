import express from "express";
import userController from "./user.controller";
import authenticationController from "./../authentication/authentication.controller";
let router = express.Router();

// define test route
router.get('/', authenticationController.authUser, userController.getUserList );
router.get('/:id', userController.getUserById)
router.post('/', userController.createUser);
router.post('/login', userController.login);

export default router;