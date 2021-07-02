import express from "express";

export function test_get(req: express.Request, res: express.Response):void {
    res.send("Hello World aus der Api mem");
};