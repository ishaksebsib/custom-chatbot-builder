import express, { type Router } from "express";
import { authController } from "./authController";
import {
	signInValidator,
	signUpValidator,
} from "@/common/middleware/formValidators";

export const authRouter: Router = express.Router();

// Auth Routes
authRouter.post("/signup", signUpValidator, authController.signup);
authRouter.post("/signin", signInValidator, authController.signin);
authRouter.post("/refresh", authController.refresh);
authRouter.post("/signout", authController.signout);
