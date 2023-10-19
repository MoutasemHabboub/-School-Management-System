import { Body, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LoginUserDto } from './dto/login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { AttendSessionDto } from './dto/AttendSession.dto';
import { RegisterInNewClassDto } from './dto/register-in-new-class.dto';

@Injectable()
export class AppService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    @Inject('REGISTRATION_SERVICE')
    private readonly registrationClient: ClientProxy,
    @Inject('ATTENDANCE_SERVICE')
    private readonly attendanceClient: ClientProxy,
  ) {}

  async login(@Body() loginUserRequest: LoginUserDto) {
    return await this.authClient.send({ cmd: 'login' }, loginUserRequest);
  }
  async signup(@Body() createUserDto: CreateUserDto) {
    return await this.authClient.send({ cmd: 'signup' }, createUserDto);
  }
  async getClasses(id) {
    return await this.registrationClient.send({ cmd: 'getClasses' }, { id });
  }
  async getClass(id) {
    return await this.registrationClient.send({ cmd: 'getClass' }, { id });
  }
  async RegisterInNewClass(data: RegisterInNewClassDto, userId) {
    return await this.registrationClient.send(
      { cmd: 'RegisterInNewClass' },
      { ...data, userId },
    );
  }
  async getUserClasses(id) {
    return await this.registrationClient.send(
      { cmd: 'getUserClasses' },
      { id },
    );
  }
  async getClassesWithRegister() {
    return await this.registrationClient.send(
      { cmd: 'getClassesWithRegister' },
      {},
    );
  }
  async attendSession(data: AttendSessionDto, userId) {
    return await this.attendanceClient.send(
      { cmd: 'attendSession' },
      { ...data, userId },
    );
  }
  async getAttendance(id) {
    return await this.attendanceClient.send({ cmd: 'getAttendance' }, { id });
  }
  async getAttendanceClass(id, classId) {
    return await this.attendanceClient.send(
      { cmd: 'getAttendanceClass' },
      { userId: id, classId },
    );
  }
}
