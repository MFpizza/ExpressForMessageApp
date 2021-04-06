import express from "express";
import path from "path";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from 'express';
import { Database } from './database';

import appRoute from "./api/api.routing";
// import userRoute from "./api/user/user.routing";

const app = express();

import helmet from 'helmet';
app.use(helmet());

dotenv.config({
  path: path.resolve(__dirname, `./environments/${process.env.NODE_ENV}.env`),
});

console.log("start connect MongoDB");
Database.connect();
// console.log("success!");

app.get("/", (req, res, next) => {
  res.send("Hello, World!!");
});

app.use("/api/", appRoute); // '/'代表路徑
// app.use("/api/user",userRoute);

app.use(function(err: any, req: Request, res: Response, next: NextFunction) {
    res.status(500).json({ message: err.message || err });
  });

var myPort = process.env.PORT ? process.env.PORT : 3000;
app.listen(myPort, () =>
  console.log(`http server is running at port ${myPort}.`)
);