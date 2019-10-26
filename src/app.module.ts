import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from './shared/config.service';
import { SharedModule } from './shared/shared.module';
import { LotsModule } from './lots/lots.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';
import { ImagesModule } from './images/images.module';
import { JobsModule } from './jobs/jobs.module';
import { BidsModule } from './bids/bids.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => configService.typeOrmConfig,
    }),
    LotsModule,
    UsersModule,
    AuthModule,
    OrdersModule,
    ImagesModule,
    JobsModule,
    BidsModule,
  ],
})

export class AppModule {}
