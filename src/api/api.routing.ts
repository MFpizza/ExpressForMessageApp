import express from "express";
import { Request, Response, NextFunction } from "express";
import { UserModel } from "../database/models/user";
import { QueryFindOneAndUpdateOptions } from 'mongoose';
const router = express.Router();
import userRoute from './user/user.routing';
import MessageRoute from './message/message.routing';

router.use('/user/',userRoute);
router.use('/message/',MessageRoute);

router.get("/test", express.json(), (req, res, next) => {
  res.send(JSON.stringify(req.body));
});

router.get("/error", (req, res, next) => {
  next("error page.");
});

router.post("/post", express.json(), (req, res, next) => {
  res.send(JSON.stringify(req.body));
});

const errorHandler = (
  func: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => (req: Request, res: Response, next: NextFunction) =>
  func(req, res, next).catch(next);

// database 的 CRUD
// C
router.post(
  "/user",
  express.json(),
  errorHandler(async (req, res, next) => {
    const { username, email } = req.body;
    const user = new UserModel({ username, email });
    const data = await user.save();
    res.send(data);
  })
);
//R
router.get(
  "/users",
  errorHandler(async (req, res, next) => {
    const documents = await UserModel.findOne({ username: req.query.username });
    res.send(documents);
  })
);
//U
router.patch(
  "/users/:id",
  express.json(),
  errorHandler(async (req, res, next) => {
    await UserModel.updateOne(
      { _id: req.params.id },
      { username: req.body.username },
      { runValidators: true }
    );
    res.send("成功");
  })
);
//U會回傳修改直
router.patch(
  "/users/:id",
  express.json(),
  errorHandler(async (req, res, next) => {
    const options: QueryFindOneAndUpdateOptions = {
      new: true,
      runValidators: true,
    };
    const document = await UserModel.findByIdAndUpdate(
      req.params.id,
      { username: req.body.username },
      options
    );
    res.send(document);
  })
);
//D
router.delete(
  "/users/:id",
  errorHandler(async (req, res, next) => {
    await UserModel.findByIdAndRemove(req.params.id);
    res.send("刪除成功");
  })
);

router.get("/data/error", (req, res, next) => {
  // Fake API
  const getProfile = new Promise((resolve, reject) => {
    setTimeout(() => resolve({ name: "HAO", age: 22 }), 100);
  });
  const getFriends = new Promise((resolve, reject) => {
    setTimeout(() => resolve([]), 120);
  });
  const errorRequest = new Promise((resolve, reject) => {
    setTimeout(() => reject("Oops!"), 2000);
  });

  getProfile
    .then((profile) => getFriends)
    .then((friends) => errorRequest)
    .then(() => res.send("GoGoGo!"))
    .catch((err) => next(err));
});

router.get(
  "/data/error/promise",
  errorHandler(async (req, res, next) => {
    // Fake API
    const getProfile = new Promise((resolve, reject) => {
      setTimeout(() => resolve({ name: "HAO", age: 22 }), 100);
    });
    const getFriends = new Promise((resolve, reject) => {
      setTimeout(() => resolve([]), 120);
    });
    const errorRequest = new Promise((resolve, reject) => {
      setTimeout(() => reject("Oops!"), 2000);
    });

    const profile = await getProfile;
    const friends = await getFriends;
    const none = await errorRequest;
    res.send("GoGoGo!");
  })
);

export default router;
