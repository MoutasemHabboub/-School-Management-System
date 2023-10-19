import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ClientProxy } from '@nestjs/microservices';
import { AttendSessionDto } from './dto/AttendSession.dto';
import { lastValueFrom } from 'rxjs';
import { GetUserAttendedSession } from './dto/GetUserAttendedSession.dto';

@Injectable()
export class AttendanceService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('REGISTRATION_SERVICE')
    private readonly registrationClient: ClientProxy,
  ) {}
  async send(cmd, data): Promise<any> {
    return (await lastValueFrom(this.registrationClient.send({ cmd }, data)))
      .arr;
  }

  async attendSession({ userId, sessionId, classId }: AttendSessionDto) {
    const result = await this.send('CheckRegisterFromClass', {
      userId,
      classId,
      sessionId,
    });
    console.log(result);

    if (!result) {
      return new BadRequestException('not registration');
    }
    const attendance = await this.prisma.attendance.findFirst({
      where: {
        userId,
        sessionId,
      },
    });
    if (attendance) {
      return new BadRequestException('already attendant ');
    }
    return this.prisma.attendance.create({
      data: {
        userId,
        sessionId,
        classId,
      },
    });
  }
  async getUserAttendedSession({ userId, classId }: GetUserAttendedSession) {
    const attendance = await this.prisma.attendance.findMany({
      where: {
        userId,
        classId,
      },
    });
    return attendance;
  }
  async getAttendance(userId) {
    const attendances = await this.prisma.attendance.findMany({
      where: {
        userId,
      },
      orderBy: {
        classId: 'asc',
      },
    });
    const classes = await this.send('getUserClasses', { id: userId });

    const groupedByClassId = attendances.reduce(
      (acc, attendance) => {
        const { classId } = attendance;
        if (!acc[classId]) {
          acc[classId] = [];
        }
        acc[classId].push(attendance);
        return acc;
      },
      {} as Record<number, typeof attendances>,
    );
    const studentClasses = [];
    for (const studentClass of classes) {
      studentClass.class.percentage =
        ((groupedByClassId[`${studentClass.id}`]?.length ?? 0) /
          studentClass.class.sessions.length) *
        100;
      studentClass.class.registeredAt = studentClass.createdAt;
      studentClasses.push(studentClass.class);
    }
    for (const studentClass of studentClasses) {
      for (const session of studentClass.sessions) {
        session.attendance = groupedByClassId[`${studentClass.id}`]?.find(
          (attendance) => attendance.sessionId === session.id,
        )
          ? true
          : false;
      }
    }

    return studentClasses;
  }

  async getAttendanceClass(data: GetUserAttendedSession) {
    const userId = Number(data.userId);
    const classId = Number(data.classId);
    console.log(data);
    const attendances = await this.prisma.attendance.findMany({
      where: {
        userId: Number(userId),
        classId: Number(classId),
      },
      orderBy: {
        classId: 'asc',
      },
    });
    console.log(attendances);
    const classes = await this.send('getUserClasses', { id: userId });
    console.log(classes);
    let result;
    for (const studentClass of classes) {
      studentClass.class.percentage =
        ((attendances?.length ?? 0) / studentClass.class.sessions.length) * 100;
      studentClass.class.registeredAt = studentClass.createdAt;
      result = studentClass.class;
    }

    for (const session of result.sessions) {
      session.attendance = attendances?.find(
        (attendance) => attendance.sessionId === session.id,
      )
        ? true
        : false;
    }
    console.log(result);

    return result;
  }
}
