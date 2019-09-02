import { 
  Controller, Get, Put, Post, Body, UsePipes, Param,
} from '@nestjs/common';

import { Transform } from 'class-transformer';

import { LotsService } from './lots.service';
import { Lot } from '../entities/lot';

import { VadationPipe } from '../common/validation.pipe';
import { CreateLotDto } from './create-lot.dto';


interface LotsResponse {
  resources: Lot[],
  meta: object,
}

interface LotResponse {
  resource: Lot,
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
  async find(@Param('id') id: number): Promise<LotResponse> {
    return {
      resource: await this.lotsService.find(id), 
      meta: {} 
    };
  }

  @UsePipes(new VadationPipe())
  @Post()
  async create(@Body() lotData: CreateLotDto): Promise<LotResponse> {
    return {
      resource: await this.lotsService.create(lotData), 
      meta: {} 
    };
  }
}
