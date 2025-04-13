import {
    Body,
    Controller,
    Get,
    Post,
    Request,
    UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { GetCurrentUser } from "src/decorators/user.decorator";
import { Public } from "./strategies/jwt/jwt-auth.guard";
import { JWTPaylod } from "src/types/jwt-paylod";
import { GoogleOAuthGuard } from "./strategies/google/google-oauth.guard";
import { GoogleProfile } from "./strategies/google/google.strategy";

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

    @Public()
    @Get()
    @UseGuards(GoogleOAuthGuard)
    googleAuth() {}

    @Public()
    @Get("google-redirect")
    @UseGuards(GoogleOAuthGuard)
    googleAuthRedirect(@Request() req: Request & { user: GoogleProfile }) {
        return this.authService.googleLogin(req);
    }
}
