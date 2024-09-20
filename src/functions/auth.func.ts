import { User } from "@/db/schema";
import { ApiError } from "@/errors";
import {
  BaseResponse,
  hashPasswordHelper,
  verifyPasswordHelper,
} from "@/helpers";
import * as jwt from "@/helpers/jwt.helper";
import type { LoginSchema, RegisterSchema, TokenSchema } from "@/validations";
import { logger, sendMail } from "@/libs";

const register = async (jsonBody: RegisterSchema) => {
  const session = await User.startSession();
  session.startTransaction();

  try {
    const existingEmail = await User.findOne({
      email: jsonBody.email,
    });

    if (existingEmail) throw new ApiError(400, "Email is existed!");

    const hasPassword = hashPasswordHelper(jsonBody.password);

    const newUser = await User.create({
      ...jsonBody,
      password: hasPassword,
      avatar: `https://api.dicebear.com/9.x/initials/svg?seed=${jsonBody.firstName}?radius=50`,
      isVerifyEmail: false,
    });

    const tokenMail = jwt.generateTokenURI(jsonBody.email);

    await sendMail(
      jsonBody.email,
      "Verify your account",
      `<a href="${encodeURI(
        `${process.env.URL_CLIENT || ""}/verify-account?token=${tokenMail}`
      )}" target='_blank'>Click here to verify your account</a>`
    );

    newUser.tokens.push({
      value: tokenMail,
      type: "Account",
    });

    await newUser.save();

    await session.commitTransaction();

    return new BaseResponse<string>(201, "Register successfully!");
  } catch (error) {
    await session.abortTransaction();
    logger.error(error);
    throw new ApiError(400, "Database wrong!");
  } finally {
    session.endSession();
  }
};

const login = async (jsonBody: LoginSchema) => {
  const account = await User.findOne({
    email: jsonBody.email,
  });

  if (!account) throw new ApiError(400, "Credential!");

  if (!account.isVerifyEmail) throw new ApiError(403, "Account not verify!");

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
  const decoded = jwt.verifyToken(jsonBody.token);

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

const verifyEmail = async (token: string) => {
  const decoded = jwt.verifyTokenURI(token);

  const account = await User.findOne({
    email: decoded.email,
  });

  if (!account) throw new ApiError(401, "Credential");

  const existingTokenIndex = account.tokens.findIndex(
    (token) => token.type === "Account"
  );

  // if (!(token === account.tokens[existingTokenIndex].value))
  //   throw new ApiError(401, "Credential");

  if (decoded.exp && decoded.exp < Date.now() / 1000) {
    const tokenMail = jwt.generateTokenURI(account.email);

    await sendMail(
      account.email,
      "Verify your account",
      `<a href="${encodeURI(
        `${process.env.URL_CLIENT || ""}/verify-account?token=${tokenMail}`
      )}" target='_blank'>Click here to verify your account</a>`
    );

    account.tokens[existingTokenIndex].value = tokenMail;

    return new BaseResponse<string>(200, "Token resend");
  }

  account.isVerifyEmail = true;

  await account.save();

  return new BaseResponse<string>(200, "Verify Account Successfully!");
};

export { register, login, refreshToken, verifyEmail };
