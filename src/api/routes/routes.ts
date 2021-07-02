import express from "express";
import test_router from "./test/test.router";
let router = express.Router();

// define test route
router.use('/', test_router);

export default router;