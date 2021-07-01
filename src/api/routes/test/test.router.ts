import express from "express";
import * as test_controller from "./test.controller";
let router = express.Router();

// define test route
router.get('/', test_controller.test_get);

export default router;