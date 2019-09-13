import { Module } from '@nestjs/common';
import { Connection } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
// controllers
import { AppController } from './app.controller';
// services
import { AppService } from './app.service';
import { ConfigService } from './config/config.service';
// modules
import { SharedModule } from './config/share.module';
import { LotsModule } from './lots/lots.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

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
  providers: [AppService],
})

export class AppModule {
  constructor(private readonly connection: Connection) {}
}
