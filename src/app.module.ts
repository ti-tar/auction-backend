import { Module } from '@nestjs/common';
import { Connection } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigService } from './shared/config.service';
import { SharedModule } from './shared/share.module';
import { LotsModule } from './lots/lots.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { EmailService } from './email/email.service';
import { LoggerService } from './shared/logger.service';

@Module({
  imports: [
    LotsModule,
    UsersModule,
    AuthModule,
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      inject: [ConfigService],
      useFactory: ( configService: ConfigService ) => configService.typeOrmConfig,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    EmailService,
    LoggerService,
  ],
})

export class AppModule {
  constructor(private readonly connection: Connection) {}
}
