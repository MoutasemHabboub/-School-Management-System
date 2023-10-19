import { Body, Controller, Get, Post } from '@nestjs/common';
import { RegistrationService } from './registration.service';
import { MessagePattern } from '@nestjs/microservices';
import { CheckRegisterFromClassDto } from './dto/check-egister-from-class.dto';
import { RegisterInNewClassDto } from './dto/register-in-new-class.dto';

@Controller()
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}

  @Post()
  @MessagePattern({ cmd: 'RegisterInNewClass' })
  async RegisterInNewClass(@Body() data: RegisterInNewClassDto) {
    console.log(data);
    return this.registrationService.RegisterInNewClass(data);
  }

  @Get()
  @MessagePattern({ cmd: 'getUserClasses' })
  async getUserClasses(@Body('id') id) {
    console.log(id);
    return await this.registrationService.getUserClasses(id);
  }

  @Get()
  @MessagePattern({ cmd: 'getUserUnRegisterClasses' })
  async getUserUnRegisterClasses(@Body('id') id) {
    console.log(id);
    return await this.registrationService.getUserUnRegisterClasses(id);
  }

  @Get()
  @MessagePattern({ cmd: 'CheckRegisterFromClass' })
  async CheckRegisterFromClass(@Body() data: CheckRegisterFromClassDto) {
    console.log(data);
    return this.registrationService.CheckRegisterFromClass(data);
  }
}
