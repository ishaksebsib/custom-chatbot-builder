import { Response } from "express";
import { StatusCodes } from "http-status-codes";

export class CreateResponse<T = null> {
  readonly success: boolean;
  readonly message: string;
  readonly response: T;
  readonly statusCode: number;

  private constructor(
    success: boolean,
    message: string,
    response: T,
    statusCode: number,
  ) {
    this.success = success;
    this.message = message;
    this.response = response;
    this.statusCode = statusCode;
  }

  static success<T>(
    message: string,
    response: T,
    statusCode: number = StatusCodes.OK,
  ) {
    return new CreateResponse(true, message, response, statusCode);
  }

  static failure<T>(
    message: string,
    response: T,
    statusCode: number = StatusCodes.BAD_REQUEST,
  ) {
    return new CreateResponse(false, message, response, statusCode);
  }
}

export const sendResponse = <T>(
  res: Response,
  responseObject: CreateResponse<T>,
) => {
  return res.status(responseObject.statusCode).send(responseObject);
};
