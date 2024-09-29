import express, { type Router } from "express";
import UserController from "./userController";
import UserService from "./userService";
import UserRepository from "./userRepository";

export const userRouter: Router = express.Router();

const userRepo = new UserRepository();
const userService = new UserService(userRepo);
const userController = new UserController(userService);

// User Routes
userRouter.get("/", userController.getUsers);

userRouter.get("/:id", userController.getUserById);

userRouter.put("/:id", userController.updateUser);

userRouter.delete("/:id", userController.deleteUser);
