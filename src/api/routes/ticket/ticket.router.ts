//replace Ticket, ticket
import express from "express";
import authenticationMiddleware from "../../middlewares/auth.middlewares";
import ticketController from "./ticket.controller";

let router = express.Router();
router.get('/me', authenticationMiddleware.getAuthenticationMiddleware(['customer']), ticketController.getTicketListForLoggedInUser)
router.get('/:screeningId', ticketController.getTicketListForScreening );
router.put('/select/:ticketId/:cartId', ticketController.selectTicketById);
router.put('/unselect/:ticketId/:cartId', ticketController.unselectTicketById);
router.put('/pay/:ticketId', ticketController.payTicketById);
router.put('/unreserve/:ticketId', ticketController.unreserveTicketById);
router.put('/invalidate/:ticketId', ticketController.invalidateTicketById);
router.delete('/', ticketController.deleteTickets);

export default router;