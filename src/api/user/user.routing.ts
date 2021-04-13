import express, { Request, Response, NextFunction } from "express";
import { UserModel } from "../../database/models/user";
const router = express.Router();
import { QueryFindOneAndUpdateOptions } from "mongoose";
import { MessageModel } from "../../database/models/message";

// router Url = http://localhost:3000/api/user/

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

//用來創建不存在的用戶
// router.post(
//   "/createByAdmin",
//   express.json(),
//   errorHandler(async (req, res, next) => {
//     console.log(req.body);
//     const { email, password, username, hasImage } = req.body;
//     const documents = await UserModel.findOne({ email: email });
//     if (documents != null) {
//       res.send("is already created");
//     } else {
//       const user = new UserModel({ username, email, password, hasImage });
//       const data = await user.save();
//       console.log(data);
//       res.send("success");
//     }
//   })
// );

//用戶註冊
router.post(
  "/create",
  express.json(),
  errorHandler(async (req, res, next) => {
    console.log("create user");
    const { account, password, username, hasImage } = req.body;
    const documents = await UserModel.findOne({ account: account });
    if (documents != null) {
      res.send("is already created");
    } else {
      const user = new UserModel({ username, account, password, hasImage });
      const data = await user.save();
      console.log(data);
      res.send("success");
    }
  })
);
//用戶登入
router.post(
  "/login",
  express.json(),
  errorHandler(async (req, res, next) => {
    console.log("get login request");
    // console.log(req.query);
    const { account, password } = req.body;
    // console.log({ account, password });
    const documents = await UserModel.findOne({
      account: account,
      password: password,
    });
    // console.log(documents);
    if (documents == null) res.send("not found");
    else res.send(documents);
  })
);
router.post(
  "/getFriendData",
  express.json(),
  errorHandler(async (req, res, next) => {
    console.log("getFriendData request");
    // console.log(req.query);
    const { account } = req.body;
    // console.log(req)
    const documents = await UserModel.findOne({
      account: account,
    });
    // console.log(documents);
    if (documents == null) res.send("not found");
    else res.send(documents);
  })
);
// router.get(
//   "/loginAdmin",
//   errorHandler(async (req, res, next) => {
//     console.log("get login request");
//     console.log(req.query);
//     const documents = await UserModel.findOne({
//       email: req.query.email,
//       password: req.query.password,
//     });
//     // console.log(documents);
//     if (documents == null) res.send("not found");
//     else res.send(documents);
//   })
// );

//新增好友 //TODO document array add another documentObject
router.patch(
  "/:account",
  express.json(),
  errorHandler(async (req, res, next) => {
    const { account } = req.body;
    console.log("add friend");
    // console.log(req)
    const documents = await UserModel.findOne({
      account: account,
    });
    // console.log(documents);
    if (documents == null) res.send("failed");
    else {
      var f = { account: req.body.account };
      // var documents = await UserModel.findOne({ id: req.params.id});
      //documents.friend.push(f);
      const options: QueryFindOneAndUpdateOptions = {
        new: true,
        runValidators: true,
      };
      const document = await UserModel.findOneAndUpdate(
        { account: req.params.account },
        { $push: { friend: f } },
        options
      );
      // console.log(document);
      res.send(document);
    }
  })
);

//TODO 從好友葉面添加聊天室
router.patch(
  "/createChat/:account",
  express.json(),
  errorHandler(async (req, res, next) => {
    const { chatRoomName } = req.body;
    console.log("create chat room");
    //TODO 先創建聊天室
    const message = new MessageModel({chatRoomName:chatRoomName});
    const data = await message.save();
    // console.log(data);
    await UserModel.updateOne(
      { account: req.params.account  },
      {
        $push: { chatRoom: { roomId: data._id, roomName: chatRoomName } },
      }
    );
    // console.log(data);
    res.send(data._id);
    console.log("create chat room end");
  })
);

router.post(
  "/getChatRoom",
  express.json(),
  errorHandler(async (req, res, next) => {
    // console.log("get ChatRoom request");
    // console.log(req.query);
    const { account } = req.body;
    // console.log("getChatRoom");
    const documents = await UserModel.findOne(
      {
        account: account,
      },
      { chatRoom: 1 }
    );
    // console.log(documents);
    if (documents == null) {
      res.send("not found");
      // console.log("not found");
    } else res.send(documents);
    // console.log("getChatRoom end");
  })
);
router.delete(
  "/:id",
  errorHandler(async (req, res, next) => {
    await UserModel.findByIdAndRemove(req.params.id);
    res.send("刪除成功");
  })
);
export default router;
