import { NextFunction, Request, Response } from "express";
import { CreateResponse, sendResponse } from "../utils/responseHelpers";
import { logger } from "@/server";

const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  logger.error(` Error from errorHandler : ${err}`);

  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Something went wrong";
  return sendResponse(
    res,
    CreateResponse.failure(err.message, null, err.statusCode),
  );
};

export default errorHandler;
