import express from "express";
import hallController from "./hall.controller";
import authenticationMiddleware from "../../middlewares/auth.middlewares";

let router = express.Router();

// define test route
router.get('/', /*authenticationMiddleware.getAuthenticationMiddleware(['user','admin']),*/ hallController.getHallList );

// DEACTIVATED FOR MVP
//router.get('/:id', /*authenticationMiddleware.getAuthenticationMiddleware(['user','admin']),*/ hallController.getHallById);
//router.post('/', /*authenticationMiddleware.getAuthenticationMiddleware(['user','admin']),*/ hallController.createHall);
//router.put('/:id', /*authenticationMiddleware.getAuthenticationMiddleware(['user','admin']),*/ hallController.updateHallById);
//router.delete('/:id', /*authenticationMiddleware.getAuthenticationMiddleware(['user','admin']),*/ hallController.deleteHallById);
//router.delete('/',/* authenticationMiddleware.getAuthenticationMiddleware(['sysadmin']),*/ hallController.deleteHalls);

export default router;