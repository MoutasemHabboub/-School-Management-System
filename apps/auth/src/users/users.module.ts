import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma.service';
import {  ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
  exports: [UsersService],
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt', property: 'user' }),
    JwtModule.registerAsync({
      imports: [],
      useFactory: async (configService: ConfigService) => ({
        publicKey: Buffer.from(
          configService.get<string>('ACCESS_TOKEN_PUBLIC_KEY'),
          'base64',
        ).toString('ascii'),
        privateKey: Buffer.from(
          configService.get<string>('ACCESS_TOKEN_PRIVATE_KEY'),
          'base64',
        ).toString('ascii'),
        signOptions: {
          algorithm: 'RS256',
          expiresIn:
            configService.get<string>('ACCESS_TOKEN_EXPIRATION') ?? '2h',
        },
        verifyOptions: {
          algorithms: ['RS256'],
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class UsersModule {}
