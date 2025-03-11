// Auth utils

import jwt from "jsonwebtoken";

export const createToken = (
  jwtPayload: { userId: string; role: string },
  secret: string,
  expiresIn: string
): string => {
  return jwt.sign(jwtPayload, secret, { expiresIn });
};
