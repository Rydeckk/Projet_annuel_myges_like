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
import { GoogleAuthGuard } from "./strategies/google/google-auth.guard";
import { GoogleProfile } from "./strategies/google/google.strategy";
import { MicrosoftAuthGuard } from "./strategies/microsoft/microsoft-auth.guard";
import { MicrosoftProfile } from "./strategies/microsoft/microsoft.strategy";

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
    @Get("google")
    @UseGuards(GoogleAuthGuard)
    googleAuth() {}

    @Public()
    @Get("google-redirect")
    @UseGuards(GoogleAuthGuard)
    googleAuthRedirect(@Request() req: Request & { user: GoogleProfile }) {
        return {
            message: "User information from google",
            user: req.user,
        };
    }

    @Public()
    @Get("microsoft")
    @UseGuards(MicrosoftAuthGuard)
    microsoftLogin() {}

    @Public()
    @Get("microsoft/callback")
    @UseGuards(MicrosoftAuthGuard)
    microsoftLoginCallback(
        @Request() req: Request & { user: MicrosoftProfile },
    ) {
        return {
            message: "Microsoft login successful",
            user: req.user,
        };
    }
}
