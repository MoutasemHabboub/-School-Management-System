import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from '../interfaces/token-payload.interface';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('ACCESS_TOKEN_PRIVATE_KEY'),
      issuer: `${configService.get<string>('ENV')}.${configService.get<string>(
        'ISSUER',
      )}`,
      algorithms: ['RS256'],
    });
  } 

  async validate(s: TokenPayload) {
    console.log(s);
    return this.usersService.getUser(s.userId);
  }
}
