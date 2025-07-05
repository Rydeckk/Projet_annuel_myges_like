import { UserRole } from "@prisma/client";
import { Exclude } from "class-transformer";

export class UserEntity {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    firstName: string;
    lastName: string;

    @Exclude()
    password: string;

    role: UserRole;

    constructor(partial: Partial<UserEntity>) {
        Object.assign(this, partial);
    }
}
