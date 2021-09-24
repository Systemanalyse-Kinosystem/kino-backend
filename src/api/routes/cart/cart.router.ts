//replace Cart, cart
import express from "express";
import cartController from "./cart.controller"

let router = express.Router();

//maybe add /me routes so that the carts are persistent later
router.get('/:id', cartController.getCartById );
router.post('/', cartController.createCart );
router.put('/checkout/book/:id', cartController.checkOutCartBook );
router.put('/checkout/reserve/:id', cartController.checkOutCartReserve );
router.put('/checkout/book/me', cartController.checkOutCartBook );
router.put('/checkout/reserve/me', cartController.checkOutCartReserve );


export default router;