import { User } from "@/db/schema";
import { ApiError } from "@/errors";
import {
  BaseResponse,
  hashPasswordHelper,
  verifyPasswordHelper,
} from "@/helpers";
import * as jwt from "@/helpers/jwt.helper";
import type { LoginSchema, RegisterSchema } from "@/validations";

const register = async (jsonBody: RegisterSchema) => {
  const existingEmail = await User.findOne({
    email: jsonBody.email,
  });

  if (existingEmail) throw new ApiError(400, "Email is existed!");

  const hasPassword = hashPasswordHelper(jsonBody.password);

  await User.create({
    ...jsonBody,
    password: hasPassword,
    isVerifyEmail: false,
  });

  return new BaseResponse<string>(201, "Register successfully!");
};

const login = async (jsonBody: LoginSchema) => {
  const account = await User.findOne({
    email: jsonBody.email,
  });

  if (!account) throw new ApiError(400, "Credential!");

  const isMatchPassword = verifyPasswordHelper(
    jsonBody.password,
    account.password ?? "",
  );

  if (!isMatchPassword) throw new ApiError(400, "Credential!");

  const payload = {
    id: account.id,
    email: account.email,
    fullName: `${account.firstName} ${account.lastName}`,
  };

  const token = jwt.generateToken(payload);

  const existingTokenIndex = account.tokens.findIndex(
    (token) => token.type === "Refresh",
  );

  if (existingTokenIndex > -1) {
    account.tokens[existingTokenIndex].value = token.rf_token;
  } else {
    account.tokens.push({
      value: token.rf_token,
      type: "Refresh",
    });
  }

  await account.save();

  return new BaseResponse<object>(200, token);
};

export { register, login };
