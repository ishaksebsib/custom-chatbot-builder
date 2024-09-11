import express, { type Router } from "express";
import { userController } from "./userController";

export const userRouter: Router = express.Router();

// User Routes
userRouter.get("/", userController.getUsers);

userRouter.get("/:id", userController.getUserById);

userRouter.put("/:id", userController.updateUser);

userRouter.delete("/:id", userController.deleteUser);
