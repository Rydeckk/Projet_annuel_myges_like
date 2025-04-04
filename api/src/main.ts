import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    credentials: true,
  } as CorsOptions);
  await app.listen(process.env.PORT ?? 3000);
};

void bootstrap();
