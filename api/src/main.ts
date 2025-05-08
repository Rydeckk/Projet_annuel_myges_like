import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe } from "@nestjs/common";

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

    await app.listen(PORT, () => {
        console.log(`Application is running on: http://localhost:${PORT}`);
    });
};

void bootstrap();
