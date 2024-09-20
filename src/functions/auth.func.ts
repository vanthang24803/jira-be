import { User } from "@/db/schema";
import { ApiError } from "@/errors";
import {
  BaseResponse,
  hashPasswordHelper,
  verifyPasswordHelper,
} from "@/helpers";
import * as jwt from "@/helpers/jwt.helper";
import type { LoginSchema, RegisterSchema, TokenSchema } from "@/validations";

const register = async (jsonBody: RegisterSchema) => {
  const existingEmail = await User.findOne({
    email: jsonBody.email,
  });

  if (existingEmail) throw new ApiError(400, "Email is existed!");

  const hasPassword = hashPasswordHelper(jsonBody.password);

  await User.create({
    ...jsonBody,
    password: hasPassword,
    avatar: `https://api.dicebear.com/9.x/initials/svg?seed=${jsonBody.firstName}?radius=50`,
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
    account.password ?? ""
  );

  if (!isMatchPassword) throw new ApiError(400, "Credential!");

  const payload = {
    id: account.id,
    email: account.email,
    fullName: `${account.firstName} ${account.lastName}`,
  };

  const token = jwt.generateToken(payload);

  const existingTokenIndex = account.tokens.findIndex(
    (token) => token.type === "Refresh"
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

const refreshToken = async (jsonBody: TokenSchema) => {
  const decoded = await jwt.verifyToken(jsonBody.token);

  const account = await User.findOne({
    email: decoded.data.email,
  });

  if (!account) throw new ApiError(401, "Credential");

  const payload = {
    id: account.id,
    email: account.email,
    fullName: `${account.firstName} ${account.lastName}`,
  };

  const existingTokenIndex = account.tokens.findIndex(
    (token) => token.type === "Refresh"
  );

  if (decoded.exp && decoded.exp < Date.now() / 1000 + 24 * 60 * 60) {
    const token = jwt.generateToken(payload);
    account.tokens[existingTokenIndex].value = token.rf_token;
  }

  const ac_token = jwt.generateAccessToken(payload);

  const token = {
    ac_token,
    rf_token: account.tokens[existingTokenIndex].value,
  };

  await account.save();

  return new BaseResponse<object>(200, token);
};

export { register, login, refreshToken };
