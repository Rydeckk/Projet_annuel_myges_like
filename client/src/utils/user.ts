import { User } from "@/types/User";

export const getUserFullName = (user: User) =>
  `${user.firstName} ${user.lastName}`;
