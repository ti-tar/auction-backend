import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UI, createQueues } from 'bull-board';
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
import { JobsModule } from './jobs/jobs.module';
import { QUEUE_NAMES } from './jobs/jobsList';

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
    JobsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    EmailService,
    LoggerService,
  ],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    if (process.env.NODE_ENV === 'development') {
      const redisConfig = {
        redis: {
          host: process.env.REDIS_HOST,
          port: process.env.REDIS_PORT,
        },
      };
      const queues = createQueues(redisConfig);
      queues.add(QUEUE_NAMES.LOTS);
      consumer
        .apply(UI)
        .forRoutes('/queues');
      }
    }
}
