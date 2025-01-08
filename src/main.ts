import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true, // class-transformer가 타입변환까지 해준다.
      },
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
