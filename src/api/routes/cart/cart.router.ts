//replace Cart, cart
import express from "express";
import authenticationMiddleware from "../../middlewares/auth.middlewares";
import cartController from "./cart.controller"

let router = express.Router();

//maybe add /me routes so that the carts are persistent later
router.get('/:id', cartController.getCartById );
router.post('/', cartController.createCart );
router.put('/checkout/book/:id', cartController.checkOutCartBook );
router.put('/checkout/book/me', authenticationMiddleware.getAuthenticationMiddleware(['customer']) ,cartController.checkOutCartBookWithLogin );
router.put('/checkout/reserve/me', authenticationMiddleware.getAuthenticationMiddleware(['customer']), cartController.checkOutCartReserveWithLogin );


export default router;