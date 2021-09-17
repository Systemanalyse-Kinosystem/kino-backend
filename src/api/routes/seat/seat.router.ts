//replace Seat, Placeholder small
import express from "express";
import seatController from "./seat.controller"

let router = express.Router();
/* TEMPEXCLUDE FOR MVP
router.get('/', seatController.getSeatList );

router.get('/', seatController.getSeatById);
router.post('/', seatController.createSeat);
router.put('/:id', seatController.updateSeatById);
router.delete('/:id', seatController.deleteSeatById);

router.delete('/', seatController.deleteSeats);

*/

export default router;