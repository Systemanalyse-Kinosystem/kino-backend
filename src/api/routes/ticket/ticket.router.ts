//replace Ticket, ticket
import express from "express";
import ticketController from "./ticket.controller";

let router = express.Router();

router.get('/:screeningId', ticketController.getTicketListForScreening );
router.put('/select/:ticketId', ticketController.selectTicketById);
router.put('/unselect/:ticketId', ticketController.unselectTicketById);
router.put('/pay/:ticketId', ticketController.payTicketById);
router.put('/invalidate/:ticketId', ticketController.invalidateTicketById);
router.delete('/', ticketController.deleteTickets);

export default router;