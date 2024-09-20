import type { StatusCodes } from "http-status-codes";

export class ApiError extends Error {
  public code: StatusCodes;
  public error: any;
  public timestamp: Date;

  constructor(code: StatusCodes, error: any) {
    super(error);
    this.code = code;
    this.error = error;
    this.timestamp = new Date();
  }
}
