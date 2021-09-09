import express from "express";
import customerController from "./customer.controller";
import authenticationMiddleware from "./../../middlewares/auth.middlewares"

let router = express.Router();

router.get('/me', authenticationMiddleware.getAuthenticationMiddleware(['customer']), customerController.getLoggedInCustomer);
router.get('/', authenticationMiddleware.getAuthenticationMiddleware(['admin']), customerController.getCustomerList);
router.get('/', authenticationMiddleware.getAuthenticationMiddleware(['admin', 'customer']), customerController.getCustomerById);
//router.post('/', authenticationMiddleware.getAuthenticationMiddleware(['user', 'admin']), customerController.createCustomer);
router.put('/:id', authenticationMiddleware.getAuthenticationMiddleware(['customer', 'admin']), customerController.updateCustomerById);
router.delete('/:id', authenticationMiddleware.getAuthenticationMiddleware(['customer', 'admin']), customerController.deleteCustomerById);
router.delete('/', authenticationMiddleware.getAuthenticationMiddleware(['admin']), customerController.deleteCustomers);

export default router;