import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { TokenPayload } from './interfaces/token-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login.dto';
import { UsersService } from './users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async login(user) {
    const tokenPayload: TokenPayload = {
      userId: user.id,
      userName: user.userName,
    };

    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.get('JWT_EXPIRATION'),
    );
    const privateKey = this.configService.get<string>(
      'ACCESS_TOKEN_PRIVATE_KEY',
    );
    const issuer = `${this.configService.get('ENV')}.${this.configService.get(
      'ISSUER',
    )}`;
    const token: string = this.jwtService.sign(tokenPayload, {
      expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRATION'),
      privateKey,
      issuer,
    });

    return token;
  }

  async validateUser(data: LoginUserDto) {
    try {
      const user = await this.userService.verifyUser(data);
      if (!user) {
        return new UnauthorizedException(
          'username or password is not correct ',
        );
      }
      return this.login(user);
    } catch (err) {
      return err;
    }
  }
}
