import { Body, Controller, Get, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { GetCurrentUser } from "src/decorators/user.decorator";
import { Public } from "./jwt-auth.guard";
import { JWTPaylod } from "src/types/jwt-paylod";

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @Public()
    @Post("login")
    signIn(@Body() signInDto: { username: string; pass: string }) {
        return this.authService.login(signInDto);
    }

    @Public()
    @Get("public")
    publicTest() {
        return "public";
    }

    @Get("profile")
    getProfile(
        @GetCurrentUser()
        user: JWTPaylod,
    ) {
        return user;
    }
}
