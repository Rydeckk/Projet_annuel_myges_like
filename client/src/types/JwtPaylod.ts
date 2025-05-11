import { UserRole } from "@/enums/UserRole";

export type JWTPaylod = {
  sub: string;
  scope: UserRole;
  iat: number;
  exp: number;
};
