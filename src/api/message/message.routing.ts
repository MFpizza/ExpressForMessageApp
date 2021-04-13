import express, { Request, Response, NextFunction } from "express";
import { MessageModel } from "../../database/models/message";
const router = express.Router();
import { QueryFindOneAndUpdateOptions } from "mongoose";

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

router.get(
  "message",
  express.json,
  errorHandler(async (req, res, next) => {
    res.send("message");
    console.log("message");
  })
);

router.post(
  "/:id",
  express.json(),
  errorHandler(async (req, res, next) => {
    // var message1 = { message: req.body.message,time:req.body.time,SendingAccount:req.body.SendingAccount };
      // var documents = await UserModel.findOne({ id: req.params.id});
      //documents.friend.push(f);

      // console.log("post chatroomId");
      const document = await MessageModel.find(
        { _id: req.params.id },
        { messageList : 1}
      );
      // console.log(document);
      res.send(document);
  })
);

//TODO 傳送訊息
router.patch(
  "/:id",
  express.json(),
  errorHandler(async (req, res, next) => {
    console.log("patch chatroomId");
    var message1 = { message: req.body.message,time:req.body.time,SendingAccount:req.body.SendingAccount };
      // var documents = await UserModel.findOne({ id: req.params.id});
      //documents.friend.push(f);
    console.log(message1);
    await MessageModel.updateOne(
        { _id: req.params.id },
        { $push: { messageList:message1 } },
      );
    console.log(document);
    res.send('success');
  })
);
export default router;