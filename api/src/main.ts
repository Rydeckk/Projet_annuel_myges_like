import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";
import { ConfigService } from "@nestjs/config";
import { ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common";
import { json } from "express";

const bootstrap = async () => {
    const app = await NestFactory.create(AppModule);

    const configService = app.get(ConfigService);
    const PORT = configService.get<number>("port") ?? 3000;

    app.enableCors({
        credentials: true,
    } as CorsOptions);

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidUnknownValues: true,
        }),
    );

    app.useGlobalInterceptors(
        new ClassSerializerInterceptor(app.get(Reflector)),
    );

    app.use(json({ limit: "50mb" }));

    await app.listen(PORT, () => {
        console.log(`Application is running on: http://localhost:${PORT}`);
    });
};

void bootstrap();
