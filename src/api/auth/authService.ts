import { env } from "@/common/utils/envConfig";
import { CreateResponse } from "@/common/utils/responseHelpers";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import UserRepository from "../user/userRepository";
import { IUser } from "../user/userModel";
import { NextFunction, Request, Response } from "express";
import errorHandler from "@/common/middleware/errorHandler";

class AuthService {
  private _userRepo: UserRepository;

  constructor(usrRepository: UserRepository = new UserRepository()) {
    this._userRepo = usrRepository;
  }

  public async signup(user: IUser, next: NextFunction) {
    const { firstName, lastName, email, password } = user;

    try {
      const existingUser = await this._userRepo.findByEmail(email);
      if (existingUser) {
        return CreateResponse.failure(
          "User with this email already exists",
          null,
          StatusCodes.BAD_REQUEST,
        );
      }
    } catch (error) {
      next(error);
    }

    //TODO: find more elegant way to validate user input

    if (!firstName || !lastName || !email || !password) {
      return CreateResponse.failure(
        "First name, last name, email and password are required",
        null,
        StatusCodes.BAD_REQUEST,
      );
    }

    // check for strong password
    const strongPassword = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})",
    );

    if (!strongPassword.test(password)) {
      return CreateResponse.failure(
        " Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character",
        null,
        StatusCodes.BAD_REQUEST,
      );
    }

    //TODO: encrypt password

    let newUser;
    try {
      newUser = await this._userRepo.create({
        firstName,
        lastName,
        email,
        password,
      });
    } catch (error) {
      next(error);
    }

    return CreateResponse.success("User created successfully", newUser);
  }

  public async signin(
    { email, password }: { email: string; password: string },
    res: Response,
  ) {
    if (!email || !password) {
      return CreateResponse.failure(
        "Email and password are required",
        null,
        StatusCodes.BAD_REQUEST,
      );
    }

    const user = await this._userRepo.findByEmail(email);
    const isPasswordValid = password === user?.password;

    if (!user || !isPasswordValid) {
      return CreateResponse.failure(
        "Invalid email or password",
        null,
        StatusCodes.UNAUTHORIZED,
      );
    }

    const accessToken = jwt.sign({ id: user.id }, env.JWT_ACCESS_TOKEN_SECRET, {
      expiresIn: env.JWT_ACCESS_TOKEN_EXPIRATION,
    });

    const refreshToken = jwt.sign(
      { id: user.id },
      env.JWT_REFRESH_TOKEN_SECRET,
      {
        expiresIn: env.JWT_REFRESH_TOKEN_EXPIRATION,
      },
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return CreateResponse.success("Login successful", { accessToken });
  }

  public async refresh(req: Request) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return CreateResponse.failure(
        "Refresh token is required",
        null,
        StatusCodes.BAD_REQUEST,
      );
    }

    const isValidRefreshToken = jwt.verify(
      refreshToken,
      env.JWT_REFRESH_TOKEN_SECRET,
    );

    if (!isValidRefreshToken) {
      return CreateResponse.failure(
        "Invalid refresh token",
        null,
        StatusCodes.UNAUTHORIZED,
      );
    }

    const user = await this._userRepo.findById(
      (isValidRefreshToken as { id: string }).id,
    );

    if (!user) {
      return CreateResponse.failure(
        "User not found",
        null,
        StatusCodes.NOT_FOUND,
      );
    }

    const accessToken = jwt.sign({ id: user.id }, env.JWT_ACCESS_TOKEN_SECRET, {
      expiresIn: env.JWT_ACCESS_TOKEN_EXPIRATION,
    });

    return CreateResponse.success("Token refreshed", { accessToken });
  }

  public async signout(res: Response) {
    res.clearCookie("refreshToken");
    return CreateResponse.success("Logout successful", null);
  }
}

export const authService = new AuthService();
