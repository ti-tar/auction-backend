import { Module } from '@nestjs/common';
import { LoggerService } from '../shared/logger.service';
import { SeederService } from './seeder.service';
import { UsersService } from '../users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from '../shared/shared.module';
import { ConfigService } from '../shared/config.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { User } from '../entities/user';
import { DatabaseService } from '../../test/database/database.service';
import { TestUtilsService } from '../shared/test-utils.service';

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
  ],
  providers: [
    LoggerService, SeederService, UsersService, ConfigService, DatabaseService, TestUtilsService, LoggerService,
  ],
})
export class SeederModule {}
