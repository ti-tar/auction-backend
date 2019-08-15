import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lot } from '../entities/lot';
import { LotsService } from '../lots/lots.service';
import { LotsController } from '../lots/lots.controller';


@Module({
  imports: [TypeOrmModule.forFeature([Lot])],
  providers: [LotsService],
  controllers: [LotsController],
})

export class LotsModule {}
