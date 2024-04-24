import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const PORT: number = Number(process.env.PORT);

  const app: INestApplication<ExpressAdapter> =
    await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      excludePrefixes: ['_'],
    }),
  );

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  app.use(cookieParser());

  if (process.env.SWAGGER_DOCS) {
    const config: Omit<OpenAPIObject, 'paths'> = new DocumentBuilder()
      .setTitle('CRM-backend')
      .setDescription('REST API для управления базой данных клиентов.')
      .addBearerAuth()
      .build();
    const document: OpenAPIObject = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, { useGlobalPrefix: true });
  }

  app.enableCors({
    allowedHeaders: ['*'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
  });

  await app.listen(PORT);
}

bootstrap().then();
