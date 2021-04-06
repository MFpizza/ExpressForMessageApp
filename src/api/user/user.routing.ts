import express, { Request, Response, NextFunction } from "express";
import { UserModel } from "../../database/models/user";
const router = express.Router();

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
router.post(
  "/createByAdmin",
  express.json(),
  errorHandler(async (req, res, next) => {
    console.log(req.body);
    const { email, password, username, hasImage } = req.body;
    const documents = await UserModel.findOne({ email: email });
    if (documents != null) {
      res.send("is already created");
    } else {
      const user = new UserModel({ username, email, password, hasImage });
      const data = await user.save();
      console.log(data);
      res.send("success");
    }
  })
);

//用戶註冊
router.post(
  "/create",
  express.json(),
  errorHandler(async (req, res, next) => {
    // console.log(req.body);
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
     console.log({ account, password } );
    const documents = await UserModel.findOne({
      account: account,
      password: password,
    });
    console.log(documents);
    if (documents == null) res.send("not found");
    else res.send(documents);
  })
);
router.post(
  "/getFriendData",
  express.json(),
  errorHandler(async (req, res, next) => {
    console.log("get login request");
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
    console.log(account);
    // console.log(req)
    const documents = await UserModel.findOne({
      account: account,
    });
    if(documents == null) res.send("failed");
    else{
    var f = { account: req.body.account };
    // var documents = await UserModel.findOne({ id: req.params.id});
    //documents.friend.push(f);
    console.log(await UserModel.updateOne({ account: req.params.account }, { $push: { friend: f } }));
    res.send("success");}
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
