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
  return jwt.verify(token, process.env.JWT_REFRESH || "") as JwtPayload;
};

export {
  generateAccessToken,
  generateToken,
  generateRefreshToken,
  verifyToken,
};
