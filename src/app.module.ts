import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigService } from './shared/config.service';
import { SharedModule } from './shared/shared.module';
import { LotsModule } from './lots/lots.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { EmailService } from './email/email.service';
import { LoggerService } from './shared/logger.service';
import { OrdersModule } from './orders/orders.module';
import { ImagesModule } from './images/images.module';

@Module({
  imports: [
    LotsModule,
    UsersModule,
    AuthModule,
    OrdersModule,
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => configService.typeOrmConfig,
    }),
    ImagesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    EmailService,
    LoggerService,
  ],
})

export class AppModule {}
