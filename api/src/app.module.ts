import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { APP_GUARD } from "@nestjs/core";
import { ConfigModule } from "@nestjs/config";
import configuration from "./config/configuration";
import { JwtAuthGuard } from "./auth/strategies/jwt/jwt-auth.guard";
import { StudentsModule } from "./students/students.module";
import { TeachersModule } from "./teachers/teachers.module";
import { PrismaModule } from "./prisma/prisma.module";
import { UploadModule } from "./upload/upload.module";
import { GoogleCloudStorageService } from "./google-cloud-storage/google-cloud-storage.service";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
        }),
        PrismaModule,
        AuthModule,
        UsersModule,
        StudentsModule,
        TeachersModule,
        UploadModule,
    ],
    controllers: [],
    providers: [
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
        GoogleCloudStorageService,
    ],
})
export class AppModule {}
