import express from "express";
import testModel from "../../models/test/test.model";

class testController {

    static test_get(req: express.Request, res: express.Response): void {
        testModel.find({}, (err, test) => {
            if (err) { return res.status(500).json(err) }
            res.json(test);
        })
    };

    static test_post(req: express.Request, res: express.Response): void {
        console.log("heyho");
        testModel.create({name: req.body.name}, (err, doc) => {
            if (err) {
                return res.status(500).json(err);
            }
            res.json(doc);
        });
    }

}

export default testController;