import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Post,
    Request,
    UnauthorizedException,
    UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Public } from "./strategies/jwt/jwt-auth.guard";
import { GoogleAuthGuard } from "./strategies/google/google-auth.guard";
import { MicrosoftAuthGuard } from "./strategies/microsoft/microsoft-auth.guard";
import { LoginDto, RegisterDto } from "./dto/auth.dto";
import { compare, genSalt, hash } from "bcryptjs";
import { UsersService } from "src/users/users.service";
import { UserRole } from "@prisma/client";
import { SsoUser } from "src/types/sso";

@Controller("auth")
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
    ) {}

    @Public()
    @Post("register")
    async register(@Body() { email, password, ...data }: RegisterDto) {
        const salt = await genSalt(10);
        const hashedPassword = await hash(password, salt);

        const existingUser = await this.usersService.findFirst({
            OR: [
                { email },
                {
                    emails: {
                        some: {
                            email,
                        },
                    },
                },
            ],
        });

        if (existingUser) {
            throw new HttpException(
                `The email ${email} already exists`,
                HttpStatus.CONFLICT,
            );
        }

        return this.authService.register({
            registerData: {
                ...data,
                email,
                password: hashedPassword,
            },
        });
    }

    @Public()
    @Post("login")
    async login(@Body() { email, password }: LoginDto) {
        const user = await this.usersService.findFirst({
            OR: [
                { email },
                {
                    emails: {
                        some: {
                            email,
                        },
                    },
                },
            ],
        });
        const isPasswordMatch = await compare(password, user?.password ?? "");

        if (!user || !isPasswordMatch) {
            throw new UnauthorizedException("Email or password is not correct");
        }

        return this.authService.login(user);
    }

    async ssoLogin({
        email,
        provider,
        ...data
    }: {
        email: string;
        firstName: string;
        lastName: string;
        provider: string;
    }) {
        const user = await this.usersService.findFirst({
            OR: [
                { email },
                {
                    emails: {
                        some: {
                            email,
                            ssoProvider: provider,
                        },
                    },
                },
            ],
        });

        if (!user) {
            const DEFAULT_SSO_PASSWORD = email;
            const salt = await genSalt(10);
            const hashedPassword = await hash(DEFAULT_SSO_PASSWORD, salt);
            return this.authService.register({
                registerData: {
                    ...data,
                    email,
                    password: hashedPassword,
                    role: UserRole.TEACHER,
                    shouldUpdatePassword: true,
                },
                ssoProvider: provider,
            });
        }

        return this.authService.login(user);
    }

    @Public()
    @Get("google")
    @UseGuards(GoogleAuthGuard)
    async googleAuth() {}

    @Public()
    @Get("google-redirect")
    @UseGuards(GoogleAuthGuard)
    async googleSsoCallback(
        @Request()
        req: Request & SsoUser,
    ) {
        return this.ssoLogin(req.user);
    }

    @Public()
    @Get("microsoft")
    @UseGuards(MicrosoftAuthGuard)
    async microsoftLogin() {}

    @Public()
    @Get("microsoft-redirect")
    @UseGuards(MicrosoftAuthGuard)
    async microsoftSsoCallback(
        @Request()
        req: Request & SsoUser,
    ) {
        return this.ssoLogin(req.user);
    }
}
