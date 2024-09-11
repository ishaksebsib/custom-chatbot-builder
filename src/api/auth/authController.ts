import { env } from "@/common/utils/envConfig";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

class AuthController {
  public async login(req: Request, res: Response) {
    const { username } = req.body;

  }
}

export default AuthController;
