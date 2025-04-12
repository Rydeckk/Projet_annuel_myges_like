import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "src/users/users.service";

@Module({
    imports: [
        JwtModule.registerAsync({
            inject: [ConfigService],
            global: true,
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>("jwtSecret"),
                signOptions: { expiresIn: "100y" },
            }),
        }),
    ],
    providers: [AuthService, UsersService],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {}
