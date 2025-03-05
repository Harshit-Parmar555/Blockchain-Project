import { Router } from "express";
import {
  register,
  login,
  logout,
  checkAuth,
} from "../controllers/user.controller.js";
import { authRoute } from "../middlewares/auth.js";

const userRouter = Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.get("/logout", logout);

userRouter.get("/checkAuth", authRoute, checkAuth);

export { userRouter };
