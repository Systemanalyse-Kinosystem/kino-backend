import express from "express";
import customerController from "./customer.controller";
import authenticationMiddleware from "./../../middlewares/auth.middlewares"

let router = express.Router();

router.get('/me', authenticationMiddleware.getAuthenticationMiddleware(['customer']), customerController.getLoggedInCustomer);
router.get('/', authenticationMiddleware.getAuthenticationMiddleware(['admin']), customerController.getCustomerList);
router.get('/:id', authenticationMiddleware.getAuthenticationMiddleware(['admin']), customerController.getCustomerById);
//router.post('/', authenticationMiddleware.getAuthenticationMiddleware(['user', 'admin']), customerController.createCustomer); 
//see /register in authentication module
router.put('/me', authenticationMiddleware.getAuthenticationMiddleware(['customer']), customerController.updateLoggedInCustomer);
router.put('/:id', authenticationMiddleware.getAuthenticationMiddleware(['admin']), customerController.updateCustomerById);
router.delete('/:id', authenticationMiddleware.getAuthenticationMiddleware(['customer', 'admin']), customerController.deleteCustomerById);
router.delete('/', authenticationMiddleware.getAuthenticationMiddleware(['admin']), customerController.deleteCustomers);

export default router;