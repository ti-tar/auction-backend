import { Module } from '@nestjs/common';
import { Connection } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { LotsController } from './lots/lots.controller';
import { LotsModule } from './lots/lots.module';
import { UsersModule } from './users/users.module';
// 

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    LotsModule,
    UsersModule,
  ],  
  controllers: [AppController],
  providers: [],
})

export class AppModule {
  constructor(private readonly connection: Connection) {}
}
