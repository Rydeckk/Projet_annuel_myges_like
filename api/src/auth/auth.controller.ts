import {
    Body,
    Controller,
    Get,
    Post,
    Request,
    UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserWithDetails, GetCurrentUser } from "src/decorators/user.decorator";
import { Public } from "./strategies/jwt/jwt-auth.guard";
import { GoogleAuthGuard } from "./strategies/google/google-auth.guard";
import { GoogleProfile } from "./strategies/google/google.strategy";
import { MicrosoftAuthGuard } from "./strategies/microsoft/microsoft-auth.guard";
import { MicrosoftProfile } from "./strategies/microsoft/microsoft.strategy";
import { LoginDto, RegisterDto } from "./dto/auth.dto";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Public()
    @Post("register")
    async register(@Body() body: RegisterDto) {
        return this.authService.register(body);
    }

    @Public()
    @Post("login")
    async login(@Body() body: LoginDto) {
        return this.authService.login(body);
    }

    @Get("profile")
    getProfile(
        @GetCurrentUser()
        user: UserWithDetails,
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
