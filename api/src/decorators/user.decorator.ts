import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { JWTPaylod } from "src/types/jwt-paylod";

export const GetCurrentUser = createParamDecorator(
    (data: keyof JWTPaylod, ctx: ExecutionContext) => {
        const request = ctx
            .switchToHttp()
            .getRequest<Request & { user: JWTPaylod }>();
        const user = request.user;
        return data && user ? user[data] : user;
    },
);
