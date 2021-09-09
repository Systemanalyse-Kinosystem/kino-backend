import express from "express";
import userController from "./user.controller";
import authenticationMiddleware from "../../middlewares/auth.middlewares";

let router = express.Router();

// define test route
router.get('/me', authenticationMiddleware.getAuthenticationMiddleware(['user', 'admin']), userController.getLoggedInUser);
router.get('/', authenticationMiddleware.getAuthenticationMiddleware(['user', 'admin']), userController.getUserList);
router.get('/:id', authenticationMiddleware.getAuthenticationMiddleware(['admin', 'user']), userController.getUserById);
router.post('/', authenticationMiddleware.getAuthenticationMiddleware(['admin']), userController.createUser);
router.put('/me', authenticationMiddleware.getAuthenticationMiddleware(['user']), userController.updateLoggedInUser);
router.put('/:id', authenticationMiddleware.getAuthenticationMiddleware(['admin']), userController.updateUserById);
router.delete('/:id', authenticationMiddleware.getAuthenticationMiddleware(['admin']), userController.deleteUserById);

export default router;