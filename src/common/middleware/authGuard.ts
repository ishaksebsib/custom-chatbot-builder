import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";
import { CreateResponse, sendResponse } from "../utils/responseHelpers";

const authGuard = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return sendResponse(res, CreateResponse.failure("Unauthorized", null, 401));
  }

  const isValid = verifyToken(token);

  if (!isValid) {
    return sendResponse(res, CreateResponse.failure("Unauthorized", null, 401));
  }

  return next();
};

export default authGuard;
