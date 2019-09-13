import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { SECRET } from '../config';
import { UsersService } from '../users/users.service';
import { User } from '../entities/user';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
//
// services
// entities

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secretOrPrivateKey: SECRET,
    }),
  ],
  providers: [UsersService, AuthService],
  controllers: [AuthController],
})
// tslint:disable-next-line: one-line
export class AuthModule{}
