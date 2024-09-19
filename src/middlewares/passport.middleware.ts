import { User } from "@/db";
import { logger } from "@/libs";
import { ExtractJwt, Strategy, type StrategyOptions } from "passport-jwt";

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET ?? "",
};

export const passportMiddleware = new Strategy(opts, async (payload, done) => {
  try {
    const user = await User.findOne({
      email: payload.data.email,
    });

    if (user) {
      return done(null, user);
    }

    return done(null, false);
  } catch (error) {
    logger.error(error);
    return done(error, false);
  }
});
