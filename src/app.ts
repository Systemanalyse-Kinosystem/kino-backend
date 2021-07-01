import express from "express";
import * as bodyParser from "body-parser";
import compression from "compression";
import cors from "cors";
import morgan from 'morgan';
import apiRouter from "./api/routes/routes";

//setup environment variables
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

//setup app
const app = express();

//setup app config
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(compression());
app.use(cors());
app.use(morgan('dev'));
app.use('/', (req: express.Request, res: express.Response) => {  
    res.send("Hello World");
});

//API - router
app.use('/api', apiRouter);

//listen on port 3001
app.listen(3001, () => console.log("Server started on Port: 3001"));