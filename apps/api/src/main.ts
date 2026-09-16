import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('Fatal Model API')
    .setDescription('API do marketplace Fatal Model com IA, confiança e privacidade')
    .setVersion('0.1.0')
    .addTag('auth', 'Autenticação e autorização')
    .addTag('users', 'Gestão de usuários')
    .addTag('profiles', 'Gestão de perfis')
    .addTag('search', 'Busca e descoberta')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`🚀 Fatal Model API rodando em: http://localhost:${port}`);
  console.log(`📚 Documentação disponível em: http://localhost:${port}/api/docs`);
}

bootstrap();
