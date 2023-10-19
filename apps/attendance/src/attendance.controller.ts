import { Body, Controller, Get, Post } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { MessagePattern } from '@nestjs/microservices';
import { AttendSessionDto } from './dto/AttendSession.dto';

@Controller()
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  @MessagePattern({ cmd: 'attendSession' })
  async attendSession(@Body() data: AttendSessionDto) {
    return this.attendanceService.attendSession(data);
  }

  @Get()
  @MessagePattern({ cmd: 'getAttendance' })
  async getAttendance(@Body('id') id) {
    return this.attendanceService.getAttendance(id);
  }
}
