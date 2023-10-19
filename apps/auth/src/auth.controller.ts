import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { Response } from 'express';
import { CurrentUser } from '@app/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import {
  ApiBody,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginUserDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @UseGuards(LocalAuthGuard)
  // @Post('login')
  // @HttpCode(HttpStatus.OK)
  // @ApiBody({
  //   type: LoginUserDto,
  // })
  // @ApiOkResponse({
  //   //type: UserDto,
  //   status: 200,
  //   description: 'User profile',
  // })
  // @ApiUnauthorizedResponse({
  //   type: UnauthorizedException,
  //   status: HttpStatus.UNAUTHORIZED,
  // })
  // async login(
  //   @CurrentUser() user,
  //   @Res({ passthrough: true }) response: Response,
  // ) {
  //   const jwt = await this.authService.login(user, response);
  //   response.send(jwt);
  // }

  @MessagePattern({ cmd: 'login' })
  //  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiBody({
    type: LoginUserDto,
  })
  @ApiOkResponse({
    //type: UserDto,
    status: 200,
    description: 'User profile',
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedException,
    status: HttpStatus.UNAUTHORIZED,
  })
  async login(
    @Body() d, // @CurrentUser() user,
    //   @Res({ passthrough: true }) response: Response,
  ) {
    console.log(d);
    return await this.authService.validateUser(d);
    //   response.send(jwt);
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern('authenticate')
  async authenticate(@Payload() data: any) {
    return data.user;
  }
}
