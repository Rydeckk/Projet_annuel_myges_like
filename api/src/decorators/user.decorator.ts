import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Student, Teacher, User } from "@prisma/client";

export type UserWithDetails = (Student | Teacher) & { user: User };

export const GetCurrentUser = createParamDecorator(
    (data: keyof UserWithDetails, ctx: ExecutionContext) => {
        const request = ctx
            .switchToHttp()
            .getRequest<Request & { user: UserWithDetails }>();

        const user = request.user;

        return data && user ? user[data] : user;
    },
);
