import { env } from "@/common/utils/envConfig";
import { logger } from "@/server";
import mongoose from "mongoose";

class MongoDBConnection {
	static #instance: MongoDBConnection;
	private mongoURL: string;
	private connection: typeof mongoose | null;

	private constructor() {
		this.mongoURL = env.MONGO_URI;
		this.connection = null;
	}

	public static get instance() {
		if (!MongoDBConnection.#instance) {
			MongoDBConnection.#instance = new MongoDBConnection();
		}

		return MongoDBConnection.#instance;
	}

	async connect() {
		if (this.connection) {
			logger.info("Already connected to MongoDB");
			return this.connection;
		}

		try {
			this.handleConnectionEvents();
			this.connection = await mongoose.connect(this.mongoURL);
			return this.connection;
		} catch (error) {
			throw error;
		}
	}

	async disconnect() {
		if (!this.connection) {
			logger.info("Already disconnected from MongoDB");
			return;
		}

		try {
			await mongoose.disconnect();
			this.connection = null;
		} catch (error) {
			throw error;
		}
	}

	async closeConnection() {
		logger.info("Closing MongoDB connection");
		try {
			await mongoose.connection.close();
			logger.info("MongoDB connection closed");
		} catch (error) {
			logger.error("Error closing MongoDB connection", error);
		}
	}

	handleConnectionEvents() {
		const db = mongoose.connection;

		db.once("open", () => {
			logger.info("Connected to MongoDB");
		});

		db.on("disconnected", () => {
			logger.info("Disconnected from MongoDB");
		});

		db.on("error", (error) => {
			logger.error("Error connecting to MongoDB", error);
		});
	}
}

export const db = MongoDBConnection.instance;
