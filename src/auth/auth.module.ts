import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { User } from '../entities/user';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { EmailService } from '../email/email.service';
import { ConfigService } from '../shared/config.service';
import { LoggerService } from '../shared/logger.service';
import { JwtModule } from '@nestjs/jwt';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET_KEY'),
      }),
      imports: [SharedModule],
      inject: [ConfigService],
    }),
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [
    UsersService, AuthService,
    JwtStrategy, LocalStrategy,
    EmailService, ConfigService, LoggerService,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})

export class AuthModule {}
