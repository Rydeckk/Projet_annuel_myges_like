import { ObjectValues } from "@/utils/objectValues";

export const USER_ROLE = {
  STUDENT: "STUDENT",
  TEACHER: "TEACHER",
} as const;

export type UserRole = ObjectValues<typeof USER_ROLE>;
