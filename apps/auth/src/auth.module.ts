import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { LoggerModule } from '@app/common';
import { AuthService } from './auth.service';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
@Module({
  imports: [
    UsersModule,
    LoggerModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      validationSchema: Joi.object({
        ACCESS_TOKEN_PUBLIC_KEY: Joi.string().required(),
        ACCESS_TOKEN_PRIVATE_KEY: Joi.string().required(),
        ACCESS_TOKEN_EXPIRATION: Joi.string().required(),
        JWT_EXPIRATION: Joi.string().required(),
        HTTP_PORT: Joi.number().required(),
        TCP_PORT: Joi.number().required(),
      }),
    }),
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
  controllers: [AuthController],
  providers: [AuthService, PrismaService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
