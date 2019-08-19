import { Controller, Get, Put, Post, Body, UsePipes, Param } from '@nestjs/common';

import { LotsService } from './lots.service';
import { Lot } from '../entities/lot';

import { VadationPipe } from '../common/validation.pipe';
import { async } from 'rxjs/internal/scheduler/async';
import { CreateLotDto } from './create-lot.dto';

@Controller('lots')
export class LotsController {
  constructor(private readonly lotsService: LotsService) {}

  @Get()
  async findAll(): Promise<Lot[]> {
    return this.lotsService.findAll();
  }

  @Get(':id')
  async find(@Param('id') id: number): Promise<Lot> {
    return this.lotsService.find(id);
  }

  @UsePipes(new VadationPipe())
  @Post()
  async create(@Body() lotData: CreateLotDto) {
    return this.lotsService.create(lotData);
  }
}
