import { env } from "@/common/utils/envConfig";
import { CreateResponse } from "@/common/utils/responseHelpers";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import UserRepository from "../user/userRepository";
import { IUser } from "../user/userModel";
import { NextFunction, Request, Response } from "express";
import bycrpt from "bcrypt";

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

		try {
			await this._userRepo.create({
				firstName,
				lastName,
				email,
				password: bycrpt.hashSync(password, 10),
			});
		} catch (error) {
			next(error);
		}

		return CreateResponse.success("User created successfully", {
			firstName,
			lastName,
			email,
		});
	}

	public async signin(
		{ email, password }: { email: string; password: string },
		res: Response,
	) {
		const user = await this._userRepo.findByEmail(email);

		if (!user) {
			return CreateResponse.failure(
				"User not found",
				null,
				StatusCodes.UNAUTHORIZED,
			);
		}

		const isPasswordValid = bycrpt.compareSync(password, user.password);

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
