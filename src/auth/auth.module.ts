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
import { ConfigService } from '../shared/config.service';
import { JwtModule } from '@nestjs/jwt';
import { SharedModule } from '../shared/shared.module';
import { JobsModule } from '../jobs/jobs.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.config.jwt.secretKey,
      }),
      imports: [SharedModule],
      inject: [ConfigService],
    }),
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([User]),
    JobsModule,
  ],
  providers: [
    UsersService, AuthService,
    JwtStrategy, LocalStrategy,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})

export class AuthModule {}
