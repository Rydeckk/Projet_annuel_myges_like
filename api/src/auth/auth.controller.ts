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
import { GoogleAuthGuard } from "./strategies/google/google-auth.guard";
import { MicrosoftAuthGuard } from "./strategies/microsoft/microsoft-auth.guard";
import { LoginDto, RegisterDto } from "./dto/auth.dto";
import { compare } from "bcryptjs";
import { UsersService } from "src/users/users.service";
import { UserRole } from "@prisma/client";
import { RequestUser, SsoUser } from "types/sso";
import { HashService } from "src/services/hash.service";
import { Public } from "decorators/is-public.decorator";
import { GetCurrentUser, UserWithDetails } from "src/decorators/user.decorator";

@Controller("auth")
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
        private readonly hashService: HashService,
    ) {}

    @Public()
    @Post("register")
    async register(@Body() { email, password, ...data }: RegisterDto) {
        const existingUser = await this.usersService.findFirst({
            email,
        });

        if (existingUser) {
            throw new HttpException(
                `The email ${email} already exists`,
                HttpStatus.CONFLICT,
            );
        }

        const hashedPassword = await this.hashService.hashPassword(password);

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
            email,
        });
        const isPasswordMatch = await compare(password, user?.password ?? "");

        if (!user || !isPasswordMatch) {
            throw new UnauthorizedException("Email or password is not correct");
        }

        return this.authService.login(user);
    }

    async ssoLogin({ email, provider, providerUserId, ...data }: SsoUser) {
        const user = await this.usersService.findFirst({
            email,
        });

        if (!user) {
            const hashedPassword = await this.hashService.hashPassword(email);
            return this.authService.register({
                registerData: {
                    ...data,
                    email,
                    role: UserRole.TEACHER,
                    password: hashedPassword,
                },
                ssoData: {
                    provider,
                    providerUserId,
                },
            });
        }

        if (!user?.authProvider) {
            await this.usersService.update({
                where: {
                    id: user.id,
                },
                data: {
                    authProvider: {
                        create: {
                            provider,
                            providerUserId,
                        },
                    },
                },
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
        req: Request & RequestUser,
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
        req: Request & RequestUser,
    ) {
        return this.ssoLogin(req.user);
    }

    @Get("me")
    getCurrentUser(@GetCurrentUser() user: UserWithDetails) {
        return user;
    }
}
