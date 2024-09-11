import { env } from "@/common/utils/envConfig";
import { app, logger } from "@/server";
import { db } from "./db/connect";

const server = app.listen(env.PORT, () => {
  const { NODE_ENV, HOST, PORT } = env;
  logger.info(`Server (${NODE_ENV}) running on port http://${HOST}:${PORT}`);
});

const onCloseSignal = async () => {
  logger.info("sigint received, shutting down");

  // close db connection
  await db.closeConnection();

  // close server
  server.close(() => {
    logger.info("server closed");
    process.exit();
  });

  // Force shutdown after 10s
  setTimeout(() => process.exit(1), 10000).unref();
};

process.on("SIGINT", onCloseSignal);
process.on("SIGTERM", onCloseSignal);
