import { NestFactory } from '@nestjs/core';
import { RegistrationModule } from './registration.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(RegistrationModule);
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      port: 3040,
    },
  });
  await app.startAllMicroservices();

  await app.listen(3040);
}
bootstrap();
