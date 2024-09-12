import { sendResponse } from "@/common/utils/responseHelpers";
import { NextFunction, Request, Response } from "express";
import { authService } from "./authService";

class AuthController {
  async signup(req: Request, res: Response, next: NextFunction) {
    const user = req.body;
    const serviceResponse = await authService.signup(user, next);
    return sendResponse(res, serviceResponse);
  }

  async signin(req: Request, res: Response) {
    const serviceResponse = await authService.signin(req.body, res);
    return sendResponse(res, serviceResponse);
  }

  async refresh(req: Request, res: Response) {
    const serviceResponse = await authService.refresh(req);
    return sendResponse(res, serviceResponse);
  }

  async signout(_req: Request, res: Response) {
    const serviceResponse = await authService.signout(res);
    return sendResponse(res, serviceResponse);
  }
}

export const authController = new AuthController();
