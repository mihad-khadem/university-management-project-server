export type TUser = {
  id: string;
  password: string;
  needsPasswordChange: boolean;
  status: "in-progress" | "blocked";
  role: "admin" | "student" | "faculty";
  isDeleted: boolean;
};
