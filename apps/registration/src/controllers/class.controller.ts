import { Body, Controller, Get, Post } from '@nestjs/common';
import { ClassService } from '../services/class.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller('class')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Get()
  @MessagePattern({ cmd: 'getClassesWithRegister' })
  async getClassesWithRegister() {
    return this.classService.getClassesWithRegister();
  }
  @Get()
  @MessagePattern({ cmd: 'getClasses' })
  async getClasses() {
    return this.classService.getClasses();
  }
  @Get()
  @MessagePattern({ cmd: 'getClass' })
  async getClass(@Body('id') id) {
    return this.classService.getClass(id);
  }
}
