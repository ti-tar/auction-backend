import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { SECRET } from '../config';
import { UsersService } from '../users/users.service';
import { User } from '../entities/user';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { EmailService } from './../email/email.service';
import { ConfigService } from '../config/config.service';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secretOrPrivateKey: SECRET,
      // signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [
    UsersService, AuthService,
    JwtStrategy, LocalStrategy,
    EmailService, ConfigService,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})

// tslint:disable-next-line: one-line
export class AuthModule{}
