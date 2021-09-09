import express from "express";
import authenticationController from "./../authentication/authentication.controller";

let router = express.Router();

router.post('/login', authenticationController.login);
router.post('/register', authenticationController.registerCustomer)

export default router;