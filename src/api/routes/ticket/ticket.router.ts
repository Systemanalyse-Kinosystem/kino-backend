//replace Ticket, ticket
import express from "express";
import ticketController from "./ticket.controller";

let router = express.Router();

router.get('/:screeningId', ticketController.getTicketListForScreening );
router.put('/select/:ticketId', ticketController.selectTicketById);
router.put('/unselect/:ticketId', ticketController.selectTicketById);
router.put('/book/:ticketId', ticketController.selectTicketById);
router.put('/pay/:ticketId', ticketController.selectTicketById);
router.put('/invalidate/:ticketId', ticketController.selectTicketById);
router.put('/reserve/:ticketId', ticketController.selectTicketById);
router.delete('/', ticketController.deleteTickets);

export default router;