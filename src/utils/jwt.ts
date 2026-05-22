import jwt, { type JwtPayload } from "jsonwebtoken";

import { config } from "../config";
import type { RUser } from "../modules/users/users.interface";


export const verifyToken = (
  token: string,
  type: "access" | "refresh"
) => {
  try {
    const secret = type === "refresh" ? config.refresh_secret : config.secret;

    const decoded = jwt.verify(token, secret) as JwtPayload;

    return decoded;
  } catch (err) {
    return null;
  }
};

export const signToken = (payload: RUser) => {
  const accessToken = jwt.sign(payload, config.secret, {
    expiresIn: "1h",
  });

  const refreshToken = jwt.sign(payload, config.refresh_secret, {
    expiresIn: "30d",
  });

  return { accessToken, refreshToken };
};
