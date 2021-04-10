import express, { Request, Response, NextFunction } from "express";
import { MessageModel } from "../../database/models/message";
const router = express.Router();

const errorHandler = (
    func: (req: Request, res: Response, next: NextFunction) => Promise<void>
  ) => (req: Request, res: Response, next: NextFunction) =>
    func(req, res, next).catch(next);
  
  router.get("/test", express.json(), (req, res, next) => {
    res.send("test");
  });
  
  router.get("/error", (req, res, next) => {
    next("error page.");
  });
  

 export default router;
