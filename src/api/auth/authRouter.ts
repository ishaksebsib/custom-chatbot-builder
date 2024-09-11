import express, { type Router } from "express";
import AuthController from "./authController";

export const authRouter: Router = express.Router();
const authController = new AuthController();

// Auth Routes
authRouter.post("/login", authController.login);
