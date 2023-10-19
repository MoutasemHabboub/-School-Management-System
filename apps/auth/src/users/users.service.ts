import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma.service';
import { LoginUserDto } from '../dto/login.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: createUserDto.email, userName: createUserDto.userName }],
      },
    });
    console.log(user)
    if (user) {
      console.log(user)
      return new UnprocessableEntityException(
        'Email or username already exists.',
      );
    }
    return this.prisma.user.create({
      data: {
        ...createUserDto,
        password: await bcrypt.hash(createUserDto.password, 10),
      },
    });
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
    return this.prisma.user.findUnique({ where: { id: userId } });
  }
}
