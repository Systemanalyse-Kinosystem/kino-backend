import express from "express";
import * as bodyParser from "body-parser";
import compression from "compression";
import cors from "cors";
import morgan from 'morgan';
import mongoose from "mongoose";

//import Router
import apiRouter from "./api/routes/routes";

//setup environment variables
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();
let env: any = dotenv.parse(fs.readFileSync(path.join(__dirname, '../process.env')));

//setup app
const app = express();

//setup database connection
mongoose.connect(env.DATABASE_URL, { useNewUrlParser: true });

//setup app config
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(compression());
app.use(cors());
app.use(morgan('dev'));

//API - router
app.use('/api/v1', apiRouter);

app.use('/', (req: express.Request, res: express.Response) => {
    res.send("Hello World");
});

//listen on port 3001
app.listen(3001, () => console.log("Server started on Port: 3001"));