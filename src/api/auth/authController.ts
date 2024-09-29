import { CreateResponse, sendResponse } from "@/common/utils/responseHelpers";
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import AuthService from "./authService";

class AuthController {
  private _authService: AuthService;

  constructor(authService: AuthService) {
    this._authService = authService;
  }

  async signup(req: Request, res: Response, next: NextFunction) {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return sendResponse(
        res,
        CreateResponse.failure(
          "Validation failed",
          validationErrors.array(),
          StatusCodes.BAD_REQUEST,
        ),
      );
    }

    const serviceResponse = await this._authService.signup(req.body, next);
    return sendResponse(res, serviceResponse);
  }

  async signin(req: Request, res: Response) {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return sendResponse(
        res,
        CreateResponse.failure(
          "Validation failed",
          validationErrors.array(),
          StatusCodes.BAD_REQUEST,
        ),
      );
    }
    const serviceResponse = await this._authService.signin(req.body, res);
    return sendResponse(res, serviceResponse);
  }

  async refresh(req: Request, res: Response) {
    const serviceResponse = await this._authService.refresh(req);
    return sendResponse(res, serviceResponse);
  }

  async signout(_req: Request, res: Response) {
    const serviceResponse = await this._authService.signout(res);
    return sendResponse(res, serviceResponse);
  }
}

export default AuthController;
