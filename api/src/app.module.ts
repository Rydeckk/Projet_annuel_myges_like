import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { APP_GUARD } from "@nestjs/core";
import { ConfigModule } from "@nestjs/config";
import configuration from "../config/configuration";
import { JwtAuthGuard } from "./auth/strategies/jwt/jwt-auth.guard";
import { StudentsModule } from "./students/students.module";
import { TeachersModule } from "./teachers/teachers.module";
import { PrismaModule } from "./prisma/prisma.module";
import { PromotionsModule } from "./promotions/promotions.module";
import { ProjectsModule } from "./projects/projects.module";
import { PromotionProjectsModule } from "./promotion-projects/promotion-projects.module";
import { ReportModule } from "./report/report.module";

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
        PromotionsModule,
        ProjectsModule,
        PromotionProjectsModule,
        ReportModule,
    ],
    controllers: [],
    providers: [
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
})
export class AppModule {}
