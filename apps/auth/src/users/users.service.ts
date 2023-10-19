import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma.service';
import { LoginUserDto } from '../dto/login.dto';
import { TokenPayload } from '../interfaces/token-payload.interface';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: createUserDto.email, userName: createUserDto.userName }],
      },
    });
    console.log(user);
    if (user) {
      console.log(user);
      return new UnprocessableEntityException(
        'Email or username already exists.',
      );
    }
    const result = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: await bcrypt.hash(createUserDto.password, 10),
      },
    });
    const tokenPayload: TokenPayload = {
      userId: result.id + '',
      userName: result.userName,
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

    return { ...result, token };
  }

  async verifyUser(data: LoginUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { userName: data.userName },
    });
    const passwordIsValid = await bcrypt.compare(data.password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid.');
    }
    return user;
  }

  async getUser(userId) {
    return this.prisma.user.findUnique({ where: { id: Number(userId) } });
  }
}
