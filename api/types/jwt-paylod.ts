import { UserRole } from "@prisma/client";

export type JWTPaylod = {
    sub: string;
    scope: UserRole;
    iat: number;
    exp: number;
};
