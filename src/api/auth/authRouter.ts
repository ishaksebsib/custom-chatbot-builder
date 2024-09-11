import express, { type Router } from "express";
import { authController } from "./authController";

export const authRouter: Router = express.Router();

// Auth Routes
authRouter.post("/signup", authController.signup);
authRouter.post("/signin", authController.signin);
