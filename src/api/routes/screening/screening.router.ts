//replace Screening, screening
import express from "express";
import screeningController from "./screening.controller"

let screeningRouter = express.Router();

screeningRouter.get('/', screeningController.getScreeningList );
screeningRouter.get('/movie/:id', screeningController.getScreeningByMovieId);
screeningRouter.get('/:id', screeningController.getScreeningById);
/* DEACTIVATED FOR MVP 
screeningRouter.post('/', screeningController.createScreening);

screeningRouter.put('/:id', screeningController.updateScreeningById);
screeningRouter.delete('/:id', screeningController.deleteScreeningById);
screeningRouter.delete('/', screeningController.deleteScreenings);
*/
export default screeningRouter;