import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ClassService {
  constructor(private readonly prisma: PrismaService) {}

  async getClasses(id): Promise<any> {
    return await this.prisma.registration.findMany({
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
  }
  async getClassesWithRegister(): Promise<any> {
    return await this.prisma.class.findMany({
      include: {
        sessions: true,
        registrations: true,
        _count: true,
      },
    });
  }
  async getClass(id: number): Promise<any> {
    return await this.prisma.class.findFirst({
      where: {
        id: Number(id),
      },
      include: {
        sessions: true,
      },
    });
  }
}
