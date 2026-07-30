import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remueve propiedades que no estén en el DTO
      forbidNonWhitelisted: true, // Lanza un error si envían propiedades de más
      transform: true, // Transforma los tipos automáticamente
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('Mi API en NestJS')
    .setDescription(
      'Documentación oficial de los endpoints de la API Matemáticas Innova Lab',
    )
    .setVersion('1.0')
    .addBearerAuth() // Habilitar autenticación JWT (Bearer tokens)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Esta disponible en http://localhost:3000/api
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((err) => {
  console.error('Error al iniciar la aplicación:', err);
  process.exit(1); // Cierra el proceso de Node de forma segura
});
