import { z } from "zod";

// validation for login and register

const loginValidationSchema = z.object({
  body: z.object({
    id: z.string({ required_error: "Id is required." }),
    password: z.string({ required_error: "Password is required" }),
  }),
});
// validation for change password
const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string({
      required_error: "Old password is required",
    }),
    newPassword: z.string({ required_error: "Password is required" }),
  }),
});
// validation for refresh token
const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: "Refresh token is required!",
    }),
  }),
});

export const AuthValidation = {
  loginValidationSchema,
  changePasswordValidationSchema,
  refreshTokenValidationSchema,
};
