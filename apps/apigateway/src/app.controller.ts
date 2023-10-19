import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { LoginUserDto } from './dto/login.dto';
import { ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { CurrentUser, JwtAuthGuard } from '@app/common';
import { AttendSessionDto } from './dto/AttendSession.dto';
import { RegisterInNewClassDto } from './dto/register-in-new-class.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('login')
  @ApiBody({
    type: LoginUserDto,
  })
  @ApiBearerAuth()
  async login(@Body() createUserRequest: LoginUserDto) {
    return await this.appService.login(createUserRequest);
  }

  @Post('signup')
  @ApiBody({
    type: LoginUserDto,
  })
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.appService.signup(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('classes')
  @ApiBearerAuth()
  async getClasses(@CurrentUser() user: any) {
    return this.appService.getClasses(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('class/:id')
  @ApiParam({ type: Number, name: 'id' })
  @ApiBearerAuth()
  async getClass(@CurrentUser() user: any, @Param('id') id) {
    return this.appService.getClass(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-classes-with-register')
  @ApiBearerAuth()
  async getClassesWithRegister(@CurrentUser() user: any) {
    return this.appService.getClassesWithRegister();
  }
  @UseGuards(JwtAuthGuard)
  @Post('register-in-class')
  @ApiBearerAuth()
  async RegisterInNewClass(
    @Body() data: RegisterInNewClassDto,
    @CurrentUser() user: any,
  ) {
    return this.appService.RegisterInNewClass(data, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-user-class')
  @ApiBearerAuth()
  async getUserClasses(@CurrentUser() user: any) {
    return this.appService.getUserClasses(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-user-unregister-class')
  @ApiBearerAuth()
  async getUserUnRegisterClasses(@CurrentUser() user: any) {
    return this.appService.getUserUnRegisterClasses(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-attendance')
  @ApiBearerAuth()
  async getAttendance(@CurrentUser() user: any) {
    return this.appService.getAttendance(user.id);
  }
  @UseGuards(JwtAuthGuard)
  @Get('get-attendance-class/:id')
  @ApiBearerAuth()
  @ApiParam({ type: Number, name: 'id' })
  async getAttendanceClass(@CurrentUser() user: any, @Param('id') id: number) {
    return this.appService.getAttendanceClass(user.id, id);
  }
  @UseGuards(JwtAuthGuard)
  @Post('attend-session')
  @ApiBearerAuth()
  async attendSession(
    @Body() data: AttendSessionDto,
    @CurrentUser() user: any,
  ) {
    return this.appService.attendSession(data, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  @ApiBearerAuth()
  async get(@CurrentUser() user: any) {
    return user;
  }
}
