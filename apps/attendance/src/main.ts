import { NestFactory } from '@nestjs/core';
import { AttendanceModule } from './attendance.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AttendanceModule);
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      port: 3033,
    },
  });
  await app.startAllMicroservices();

  await app.listen(3003);
}
bootstrap();
