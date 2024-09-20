import { ApiError } from "@/errors";
import { logger } from "@/libs";
import "dotenv/config";
import jwt, { type JwtPayload } from "jsonwebtoken";

const generateToken = (data: object) => {
  const ac_token = jwt.sign({ data }, process.env.JWT_SECRET || "", {
    expiresIn: "3d",
  });

  const rf_token = jwt.sign({ data }, process.env.JWT_REFRESH || "", {
    expiresIn: "30d",
  });

  return {
    ac_token,
    rf_token,
  };
};

const generateAccessToken = (data: object) => {
  return jwt.sign({ data }, process.env.JWT_SECRET || "", {
    expiresIn: "3d",
  });
};

const generateRefreshToken = (data: object) => {
  return jwt.sign({ data }, process.env.JWT_REFRESH || "", {
    expiresIn: "30d",
  });
};

const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH || "", {
      ignoreExpiration: true,
    }) as JwtPayload;
  } catch (error) {
    logger.error(error);
    throw new ApiError(401, "Unauthorized");
  }
};

const generateTokenURI = (email: string) => {
  return jwt.sign({ email }, process.env.JWT_SECRET || "", {
    expiresIn: "10m",
  });
};

const verifyTokenURI = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || "", {
      ignoreExpiration: true,
    }) as JwtPayload;
  } catch (error) {
    logger.error(error);
    throw new ApiError(401, "Unauthorized");
  }
};

export {
  generateAccessToken,
  generateToken,
  generateRefreshToken,
  verifyToken,
  generateTokenURI,
  verifyTokenURI,
};
