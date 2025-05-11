import { USER_ROLE } from "@/enums/UserRole";
import { z } from "zod";

export const LoginResponseSchema = z.object({
  accessToken: z.string(),
  userRole: z.nativeEnum(USER_ROLE),
});
