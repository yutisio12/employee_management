import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    origin: true,
    credentials: true
  }); // CORS FOR FE

  app.setGlobalPrefix('api');

  app.use(helmet()) // WEB SECURE

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),)

  const swagConfig = new DocumentBuilder()
    .setTitle('Employee App API')
    .setDescription('API Documentation using Swagger')
    .setVersion('0.0')
    .addCookieAuth('token')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header'
    },
    'access-token'
  )
    .build() // FOR SWAGGER
  const documentAPI = SwaggerModule.createDocument(app, swagConfig)
  SwaggerModule.setup('api/docs', app, documentAPI, {
    swaggerOptions: {
      requestInterceptor: (req) => {
        const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
        if (match) {
          req.headers['Authorization'] = `Bearer ${match[2]}`;
        }
        return req;
      },
    },
  })

  // it must be at the end
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
