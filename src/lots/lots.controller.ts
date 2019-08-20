import { 
  Controller, Get, Put, Post, Body, UsePipes, Param,
} from '@nestjs/common';

import { Transform } from 'class-transformer';

import { LotsService } from './lots.service';
import { Lot } from '../entities/lot';

import { VadationPipe } from '../common/validation.pipe';
import { async } from 'rxjs/internal/scheduler/async';
import { CreateLotDto } from './create-lot.dto';
import { from } from 'rxjs';

interface LotsResponse {
  resources: Lot[],
  meta: object,
}

@Controller('lots')
export class LotsController {
  constructor(private readonly lotsService: LotsService) {}

  @Get()
  async findAll(): Promise<LotsResponse> {
    return { 
      resources: await this.lotsService.findAll(), 
      meta: {} 
    };
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
