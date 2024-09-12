import cors from "cors";
import express, { type Express } from "express";
import { pino } from "pino";
import { env } from "process";
import { healthCheckRouter } from "./api/healthChecker/healthCheckRouter";
import { chatRouter } from "./api/chat/chatRouter";
import { authRouter } from "./api/auth/authRouter";
import authGuard from "./common/middleware/authGuard";
import { db } from "./db/connect";
import { userRouter } from "./api/user/userRouter";
import errorHandler from "./common/middleware/errorHandler";

const logger = pino({ name: "server start" });
const app: Express = express();

// connect to the database
db.connect();

// Set the application to trust the reverse proxy
app.set("trust proxy", true);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));

// Routes
app.use("/", healthCheckRouter);
app.use("/api/auth", authRouter);

// Protect the routes below this middleware
app.use(authGuard);
app.use("/api/users", userRouter);
app.use("/api/chat", chatRouter);

// Error handler
app.use(errorHandler);

export { app, logger };
