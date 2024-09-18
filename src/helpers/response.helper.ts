import type { StatusCodes } from "http-status-codes";

export class BaseResponse<T> {
  private isSuccess: boolean;
  private code: StatusCodes;
  private result: T;
  private timestamp: Date;

  constructor(code: StatusCodes, result: T) {
    this.code = code;
    this.result = result;
    this.timestamp = new Date();

    if (this.code === 200 || this.code === 201) {
      this.isSuccess = true;
    } else {
      this.isSuccess = false;
    }
  }
}
