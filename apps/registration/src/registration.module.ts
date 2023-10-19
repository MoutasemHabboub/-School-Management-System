import { Module } from '@nestjs/common';
import { RegistrationController } from './registration.controller';
import { RegistrationService } from './registration.service';
import { PrismaService } from './prisma.service';
import { ClassController } from './controllers/class.controller';
import { ClassService } from './services/class.service';

@Module({
  imports: [],
  controllers: [RegistrationController, ClassController],
  providers: [RegistrationService, PrismaService, ClassService],
})
export class RegistrationModule {}
