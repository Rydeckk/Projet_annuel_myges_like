import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard, Public } from "./auth.guard";
import { User } from "src/decorators/user.decorator";
import { JWTPaylod } from "src/types/jwt-paylod";

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @Public()
    @Post("login")
    signIn(@Body() signInDto: Record<string, any>) {
        return this.authService.signIn(signInDto.username, signInDto.password);
    }

    @UseGuards(AuthGuard)
    @Get("profile")
    getProfile(
        @User()
        user: JWTPaylod,
    ) {
        console.log("getProfile", user);
        return user;
    }
}
