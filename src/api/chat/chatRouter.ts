import express, { type Router } from "express";
import { chatController } from "./chatController";

export const chatRouter: Router = express.Router();

// Chat Routes
chatRouter.post("/", chatController.getAnswer);
