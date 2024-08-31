import cors from "cors";
import express, { type Express } from "express";
import { pino } from "pino";
import { env } from "process";
import { healthCheckRouter } from "./api/healthChecker/healthCheckRouter";
import { chatRouter } from "./api/chat/chatRouter";

const logger = pino({ name: "server start" });
const app: Express = express();

// connect to the database
//connectDB();

// Set the application to trust the reverse proxy
app.set("trust proxy", true);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));

// Routes
app.use("/", healthCheckRouter);
app.use("/api/chat", chatRouter);

export { app, logger };
