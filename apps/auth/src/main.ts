/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Transport } from '@nestjs/microservices';

import { AuthModule } from './auth.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { useContainer } from 'class-validator';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AuthModule, {
    cors: true,
  });
  const configService = app.get(ConfigService);
  useContainer(app.select(AuthModule), { fallbackOnErrors: true });

  if (process.env.ENV == 'production') {
    //app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  }
  app.disable('x-powered-by');
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const globalPrefix = 'auth'; //'auth';
  const docsPath = `${globalPrefix}/docs`;
  app.setGlobalPrefix(globalPrefix);
  if (process.env.ENV != 'production') {
    const config = new DocumentBuilder()
      .setTitle('Auth Api!')
      .setDescription('API description')
      .setVersion('1.0.0')
      .addBearerAuth()
      .setContact(process.env.AUTHOR, process.env.URL, process.env.EMAIL)
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(docsPath, app, document);
    Logger.log('Swagger Enabled', 'NestApplication');
  }
  const port = process.env.AUTH_PORT || 3001;
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      port: 3002,
    },
  });
  const host = process.env.AUTH_HOST || 'localhost';
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
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
