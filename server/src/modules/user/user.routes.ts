import { Router } from "express";

import {
  loginUserController,
  registerUserController,
  currentUserController,
  logoutUserController,
} from "./user.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

const userRouter = Router();

userRouter.post("/register", registerUserController);
userRouter.post("/login", loginUserController);
userRouter.post("/logout", logoutUserController);
userRouter.get("/currentUser", authenticate, currentUserController);

export default userRouter;
