import express from "express";
import authenticationController from "./../authentication/authentication.controller";

let router = express.Router();

router.post('/login', authenticationController.login);
//aktivieren, wenn die Customer Routes bestehen
//router.get('/register', authenticationController.registerCustomer)

export default router;