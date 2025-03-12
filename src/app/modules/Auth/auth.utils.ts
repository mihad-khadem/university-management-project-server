import jwt, { Secret, SignOptions } from "jsonwebtoken";

export const createToken = (
  payload: object,
  secret: Secret,
  expireTime: string | number // Accept both string and number
): string => {
  const options: SignOptions = {
    algorithm: "HS256",
    expiresIn: expireTime as any,
  };

  return jwt.sign(payload, secret, options);
};
