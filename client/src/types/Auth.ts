import { UserRole } from "@/enums/UserRole";
import { User } from "./User";

export type RegisterRequest = Pick<
  User,
  "firstName" | "lastName" | "email" | "password" | "role"
>;

export type LoginRequest = Pick<User, "email" | "password">;

export type LoginResponse = {
  accessToken: string;
  userRole: UserRole;
};
