import { env } from "@/common/utils/envConfig";
import { CreateResponse } from "@/common/utils/responseHelpers";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

class AuthService {
  private _username: string;
  constructor(username: string) {
    this._username = username;
  }

  public async login(username: string) {
    if (!username) {
      return CreateResponse.failure(
        "Username is required",
        null,
        StatusCodes.BAD_REQUEST,
      );
    }

    const user = {
      name: username,
    };

    const accessToken = jwt.sign(user, env.JWT_ACCESS_TOKEN_SECRET);

    return CreateResponse.success("Login successful", { accessToken });
  }
}

export default AuthService;
