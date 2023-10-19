import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UsersService } from '../users/users.service';
import { LoginUserDto } from '../dto/login.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({ usernameField: 'userName' });
  }

  async validate(email: string, password: string) {
    try {
      console.log(email, '     ', password);
      return await this.usersService.verifyUser({
        userName: email,
        password,
      } as LoginUserDto);
    } catch (err) {
      throw new UnauthorizedException(err);
    }
  }
}
