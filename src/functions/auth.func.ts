import { User } from "@/db/schema";
import { ApiError } from "@/errors";
import { BaseResponse, hashPasswordHelper } from "@/helpers";
import type { RegisterSchema } from "@/validations";

const register = async (jsonBody: RegisterSchema) => {
  const existingEmail = await User.findOne({
    email: jsonBody.email,
  });

  if (existingEmail) throw new ApiError(404, "Email is existed!");

  const hasPassword = hashPasswordHelper(jsonBody.password);

  await User.create({
    ...jsonBody,
    password: hasPassword,
    isVerifyEmail: false,
  });

  return new BaseResponse<string>(201, "Register successfully!");
};

export { register };
