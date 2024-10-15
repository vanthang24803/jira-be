import { User, type UserType } from "@/db";
import { ApiError } from "@/errors";
import { BaseResponse } from "@/helpers";
import { type ProfileSchema, profileSchema } from "@/validations";

const getProfile = (jsonData: UserType | undefined) => {
  const result = profileSchema.parse(jsonData);

  return new BaseResponse<ProfileSchema>(200, result);
};

const logout = async (user: UserType | undefined) => {
  if (!user) throw new ApiError(401, "Unauthorized");

  user.tokens = user.tokens.filter((token) => token.type !== "Refresh");

  await user.save();

  return new BaseResponse<string>(200, "Logout successfully!");
};

export { getProfile, logout };
