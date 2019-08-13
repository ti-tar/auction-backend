import { Controller, Get, Post, Body, UsePipes } from '@nestjs/common';

import { LotsService } from './lots.service';
import { Lot } from './lot.interface';

import { VadationLotPipe } from '../common/validationLot.pipe';
import { CreateLotDto } from './create-lot.dto';

@Controller('lots')
export class LotsController {
  constructor(private readonly lotsService: LotsService) {}

  @Get()
  async findAll(): Promise<Lot[]> {
    return this.lotsService.findAll();
  }

  @Post()
  @UsePipes(new VadationLotPipe())
  async create(@Body() createLotDto: CreateLotDto) {
    this.lotsService.create(createLotDto);
  }
}
