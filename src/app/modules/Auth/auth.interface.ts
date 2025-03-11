// Interface

import { USER_ROLES } from "./auth.constant";

export type TUserLogin = {
  id: string;
  password: string;
};
export type TUserRoles = (typeof USER_ROLES)[keyof typeof USER_ROLES];
