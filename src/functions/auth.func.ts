import { User } from "@/db/schema";
import { ApiError } from "@/errors";
import {
  BaseResponse,
  hashPasswordHelper,
  verifyPasswordHelper,
} from "@/helpers";
import * as jwt from "@/helpers/jwt.helper";
import { logger, sendMail } from "@/libs";
import type { LoginSchema, RegisterSchema, TokenSchema } from "@/validations";

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
        `${process.env.URL_CLIENT || ""}/verify-account?token=${tokenMail}`,
      )}" target='_blank'>Click here to verify your account</a>`,
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
    account.password ?? "",
  );

  if (!isMatchPassword) throw new ApiError(400, "Credential!");

  const payload = {
    id: account.id,
    email: account.email,
    fullName: `${account.firstName} ${account.lastName}`,
  };

  const token = jwt.generateToken(payload);

  const existToken = account.tokens.find((x) => x.type === "Refresh");

  if (existToken) {
    existToken.value = token.rf_token;
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

  const existToken = account.tokens.find((x) => x.type === "Refresh");
  if (!existToken) throw new ApiError(400, "Token not found");

  if (decoded.exp && decoded.exp < Date.now() / 1000 + 24 * 60 * 60) {
    const token = jwt.generateToken(payload);
    existToken.value = token.rf_token;
  }

  const ac_token = jwt.generateAccessToken(payload);

  const token = {
    ac_token,
    rf_token: existToken.value,
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

  const mailToken = account.tokens.find((x) => x.type === "Account");

  if (!mailToken || token !== mailToken.value) {
    throw new ApiError(401, "Credential");
  }

  if (decoded.exp && decoded.exp < Date.now() / 1000) {
    const tokenMail = jwt.generateTokenURI(account.email);

    await sendMail(
      account.email,
      "Verify your account",
      `<a href="${encodeURI(
        `${process.env.URL_CLIENT || ""}/verify-account?token=${tokenMail}`,
      )}" target='_blank'>Click here to verify your account</a>`,
    );

    mailToken.value = tokenMail;
    return new BaseResponse<string>(200, "Token resend");
  }

  account.tokens = account.tokens.filter((x) => x.type !== "Account");

  account.isVerifyEmail = true;

  const tokenResponse = jwt.generateToken({
    id: account.id,
    email: account.email,
    fullName: `${account.firstName} ${account.lastName}`,
  });

  account.tokens.push({
    value: tokenResponse.rf_token,
    type: "Refresh",
  });

  await account.save();

  return new BaseResponse<object>(200, tokenResponse);
};

export { register, login, refreshToken, verifyEmail };
