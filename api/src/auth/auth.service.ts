import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { GoogleProfile } from "./strategies/google/google.strategy";

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    validateUser(username: string, pass: string) {
        const user = this.usersService.findOne(username);
        if (user && user.password === pass) {
            const { userId, username } = user;
            return {
                userId,
                username,
            };
        }
        return null;
    }

    async login({ username, pass }: { username: string; pass: string }) {
        const user = this.usersService.findOne(username);
        if (user?.password !== pass) {
            throw new UnauthorizedException();
        }
        const payload = { sub: user.userId, username: user.username };

        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    googleLogin(req: Request & { user: GoogleProfile }) {
        if (!req.user) {
            return "No user from google";
        }

        return {
            message: "User information from google",
            user: req.user,
        };
    }
}
