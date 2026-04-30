import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './shared/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // --- 1. CONFIGURATION GLOBALE ---
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors();
  app.useGlobalFilters(new AllExceptionsFilter());

  // --- 2. SWAGGER ---
  const config = new DocumentBuilder()
    .setTitle('API École Primaire')
    .setDescription("Documentation de l'API backend")
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // --- 3. LA RÉPARATION (Redirection racine vers Swagger) ---
  const httpAdapter = app.getHttpAdapter();
  httpAdapter.get('/', (req, res) => {
    res.redirect('/api/docs');
  });

  // --- 4. DÉMARRAGE ---
  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`🚀 Serveur démarré sur http://localhost:${port}`);
  console.log(`📖 Swagger disponible sur http://localhost:${port}/api/docs`);
}
bootstrap();
