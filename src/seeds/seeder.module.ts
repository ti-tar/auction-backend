import { HttpModule, Module } from '@nestjs/common';
import { LoggerService } from '../shared/logger.service';
import { SeederService } from './seeder.service';
import { UsersService } from '../users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from '../shared/shared.module';
import { ConfigService } from '../shared/config.service';
import { UsersModule } from '../users/users.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { SECRET } from '../config';
import { PassportModule } from '@nestjs/passport';
import { User } from '../entities/user';

@Module({
  imports: [
    UsersModule,

    TypeOrmModule
      .forRootAsync({
        imports: [SharedModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => configService.typeOrmConfig,
      }),
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({ secretOrPrivateKey: SECRET }),
  ],
  providers: [
    LoggerService, SeederService, UsersService, ConfigService,
  ],
})
export class SeederModule {}
