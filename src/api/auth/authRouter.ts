import express, { type Router } from "express";
import AuthService from "./authService";
import UserRepository from "../user/userRepository";
import AuthController from "./authController";
import {
  signInValidator,
  signUpValidator,
} from "@/common/middleware/formValidators";

export const authRouter: Router = express.Router();

const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

// Auth Routes
authRouter.post("/signup", signUpValidator, authController.signup);
authRouter.post("/signin", signInValidator, authController.signin);
authRouter.post("/refresh", authController.refresh);
authRouter.post("/signout", authController.signout);
