import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./strategies/jwt/jwt.strategy";
import { GoogleStrategy } from "./strategies/google/google.strategy";
import { MicrosoftStrategy } from "./strategies/microsoft/microsoft.strategy";
import { UsersService } from "src/users/users.service";
import { StudentsService } from "src/students/students.service";
import { TeachersService } from "src/teachers/teachers.service";
import { HashService } from "src/services/hash.service";

@Module({
    imports: [
        PassportModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            global: true,
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>("jwtSecret"),
                signOptions: { expiresIn: "100y" },
            }),
        }),
    ],
    providers: [
        AuthService,
        JwtStrategy,
        GoogleStrategy,
        MicrosoftStrategy,
        UsersService,
        StudentsService,
        TeachersService,
        HashService,
    ],
    controllers: [AuthController],
})
export class AuthModule {}
