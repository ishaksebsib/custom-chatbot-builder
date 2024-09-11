import { sendResponse } from "@/common/utils/responseHelpers";
import { Request, Response } from "express";
import { authService } from "./authService";

class AuthController {
  async signup(req: Request, res: Response) {
    const user = req.body;
    const serviceResponse = await authService.signup(user);
    return sendResponse(res, serviceResponse);
  }

  async signin(req: Request, res: Response) {
    const { email, password } = req.body;
    const serviceResponse = await authService.signin(email, password);
    return sendResponse(res, serviceResponse);
  }
}

export const authController = new AuthController();
