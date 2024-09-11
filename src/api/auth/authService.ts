import { env } from "@/common/utils/envConfig";
import { CreateResponse } from "@/common/utils/responseHelpers";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import UserRepository from "../user/userRepository";
import { IUser } from "../user/userModel";

class AuthService {
  private _userRepo: UserRepository;

  constructor(usrRepository: UserRepository = new UserRepository()) {
    this._userRepo = usrRepository;
  }

  public async signup(user: IUser) {
    if (!user) {
      return CreateResponse.failure(
        "User data is required",
        null,
        StatusCodes.BAD_REQUEST,
      );
    }

    //TODO: Add validation for user data

    const newUser = await this._userRepo.create(user);

    //TODO: Add error handling for user creation


		//TODO: Add password encription

    if (!newUser) {
      return CreateResponse.failure(
        "User creation failed",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }

    return CreateResponse.success("User created successfully", newUser);
  }

  public async signin(email: string, password: string) {
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

    const accessToken = jwt.sign({ email }, env.JWT_ACCESS_TOKEN_SECRET, {
      expiresIn: env.JWT_ACCESS_TOKEN_EXPIRATION,
    });

    return CreateResponse.success("Login successful", { accessToken });
  }
}

export const authService = new AuthService();
