/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { useContainer } from 'class-validator';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  if (process.env.ENV == 'production') {
    //app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  }
  app.disable('x-powered-by');
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const globalPrefix = 'gateway';
  const docsPath = `${globalPrefix}/docs`;
  app.setGlobalPrefix(globalPrefix);
  if (process.env.ENV != 'production') {
    const config = new DocumentBuilder()
      .setTitle(' Api gate way!')
      .setDescription('API description')
      .setVersion('1.0.0')
      .addBearerAuth()
      .setContact(process.env.AUTHOR, process.env.URL, process.env.EMAIL)
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(docsPath, app, document);
    Logger.log('Swagger Enabled', 'NestApplication');
  }
  const port = process.env.CONTENT_PORT || 3000;
  const host = process.env.CONTENT_HOST || 'localhost';
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: '3030',
    },
  });
  await app.startAllMicroservices();
  await app.listen(port);
  // server.setTimeout(parseInt(process.env.APP_TIMEOUT) || 1000);
  Logger.log(
    `🚀 Application is running on: http://${host}:${port}/${globalPrefix}`,
    'NestApplication',
  );
  Logger.log(
    `😎 Swagger UI on: http://${host}:${port}/${docsPath}`,
    'NestApplication',
  );
}

bootstrap();
