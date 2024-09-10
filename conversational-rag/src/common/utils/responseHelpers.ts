import { Response } from "express";
import { StatusCodes } from "http-status-codes";

export class CreateResponse<T = null> {
  readonly success: boolean;
  readonly message: string;
  readonly responseObject: T;
  readonly statusCode: number;

  private constructor(
    success: boolean,
    message: string,
    responseObject: T,
    statusCode: number,
  ) {
    this.success = success;
    this.message = message;
    this.responseObject = responseObject;
    this.statusCode = statusCode;
  }

  static success<T>(
    message: string,
    responseObject: T,
    statusCode: number = StatusCodes.OK,
  ) {
    return new CreateResponse(true, message, responseObject, statusCode);
  }

  static failure<T>(
    message: string,
    responseObject: T,
    statusCode: number = StatusCodes.BAD_REQUEST,
  ) {
    return new CreateResponse(false, message, responseObject, statusCode);
  }
}

export const sendResponse = (responseObject: CreateResponse, res: Response) => {
  return res.status(responseObject.statusCode).send(responseObject);
};
