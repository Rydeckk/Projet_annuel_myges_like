import { UserRole } from "@/enums/UserRole";
import { User } from "./User";

export type RegisterRequest = Pick<
  User,
  "firstName" | "lastName" | "email" | "role"
> & { password: string };

export type LoginRequest = Pick<User, "email"> & { password: string };

export type LoginResponse = {
  accessToken: string;
  userRole: UserRole;
};
