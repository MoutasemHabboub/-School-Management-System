import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CheckRegisterFromClassDto } from './dto/check-egister-from-class.dto';
import { RegisterInNewClassDto } from './dto/register-in-new-class.dto';

@Injectable()
export class RegistrationService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserClasses(id): Promise<any> {
    const data = await this.prisma.registration.findMany({
      where: {
        userId: Number(id),
      },
      include: {
        class: {
          include: {
            sessions: true,
            _count: true,
          },
        },
      },
    });
    return data
  }

  async getUserUnRegisterClasses(id): Promise<any> {
    return await this.prisma.class.findMany({
      where: {
        registrations: {
          every: { NOT: { userId: Number(id) } },
        },
      },
      include: {
        sessions: true,
        _count: true,
      },
    });
  }
  async RegisterInNewClass(data: RegisterInNewClassDto): Promise<any> {
    const classData = await this.prisma.class.findUnique({
      where: {
        id: data.classId,
      },
    });
    if (!classData) {
      return new NotFoundException('class does not exist ');
    }
    const registration = await this.prisma.registration.findFirst({
      where: {
        userId: data.userId,
        classId: data.classId,
      },
    });
    if (registration) {
      return new BadRequestException('already registered ');
    }
    return await this.prisma.registration.create({
      data: {
        userId: data.userId,
        classId: data.classId,
      },
    });
  }
  async CheckRegisterFromClass(data: CheckRegisterFromClassDto): Promise<any> {
    const registration = await this.prisma.registration.findFirst({
      where: {
        userId: data.userId,
        classId: data.classId,
      },
    });
    if (!registration) return false;
    const session = await this.prisma.session.findFirst({
      where: {
        id: data.sessionId,
        classId: data.classId,
      },
    });
    if (!session) return false;
    return true;
  }
}
