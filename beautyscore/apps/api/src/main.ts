import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Security headers
  app.use(helmet());

  // Cookie parser for refresh tokens
  app.use(cookieParser());

  // CORS configuration
  app.enableCors({
    origin: configService.get<string>('CORS_ORIGIN', 'http://localhost:3000'),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip non-whitelisted properties
      forbidNonWhitelisted: true, // Throw error for non-whitelisted properties
      transform: true, // Auto-transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // API prefix
  app.setGlobalPrefix('api');

  const port = configService.get<number>('PORT', 3001);
  await app.listen(port);

  console.log(`🚀 API server running on http://localhost:${port}`);
  console.log(`📚 Environment: ${configService.get<string>('NODE_ENV', 'development')}`);
}

bootstrap();
