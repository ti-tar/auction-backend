import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItemsController } from './items/items.controller';
import { ItemsService } from './items/items.service';
import { LotsController } from './lots/lots.controller';
import { LotsService } from './lots/lots.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
  ],
  controllers: [AppController, ItemsController, LotsController],
  providers: [AppService, ItemsService, LotsService],
})
export class AppModule {}
