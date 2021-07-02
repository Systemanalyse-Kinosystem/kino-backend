import express from "express";
import testController from "./test.controller";
let router = express.Router();

// define test route
router.get('/', testController.test_get);
router.post('/', testController.test_post);

export default router;