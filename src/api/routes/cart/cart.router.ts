//replace Cart, cart
import express from "express";
import authenticationMiddleware from "../../middlewares/auth.middlewares";
import cartController from "./cart.controller"

let router = express.Router();

//maybe add /me routes so that the carts are persistent later
router.get('/:id', cartController.getCartById);
router.post('/', cartController.createCart);
router.put('/checkout/book/me/:id', authenticationMiddleware.getAuthenticationMiddleware(['customer']), cartController.checkOutCartBookWithLogin );
router.put('/checkout/book/:id', cartController.checkOutCartBookWithCartId);
router.put('/checkout/reserve/:id', authenticationMiddleware.getAuthenticationMiddleware(['customer']), cartController.checkOutCartReserveWithLogin);
router.put('/checkout/reserve/nologin/:id', cartController.checkOutCartReserveWithoutLogin);


export default router;