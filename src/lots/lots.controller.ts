import { 
  Controller, Get, Put, Post, Body, UsePipes, Param, Req, Request, UseInterceptors, ClassSerializerInterceptor
} from '@nestjs/common';

import { Transform } from 'class-transformer';

import { LotsService } from './lots.service';
import { Lot } from '../entities/lot';

import { VadationPipe } from '../common/validation.pipe';
import { CreateLotDto } from './create-lot.dto';
import { UpdateLotDto } from './update-lot.dto';


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
    const lots = await this.lotsService.findAll();
    return { 
      resources: lots, 
      meta: {} 
    };
  }

  @Get('own')
  async findOwnAll(@Req() request: { [key: string]: any }): Promise<LotsResponse> {
    const { user } = request;
    const lots = await this.lotsService.findAllByUserId(user.id);
    return { 
      resources: lots, 
      meta: {} 
    };
  }

  @Get(':id')
  async find(@Param('id') id: number): Promise<LotResponse> {
    const lot: Lot =  await this.lotsService.find(id);
    console.log(lot);
    return {
      resource: lot, 
      meta: {} 
    };
  }

  @UsePipes(new VadationPipe())
  @Put(':id')
  async update(@Body() lotData: UpdateLotDto): Promise<any> {
    return {
      resource: await this.lotsService.update(lotData), 
      meta: {} 
    };
  }

  @UsePipes(new VadationPipe())
  @Post()
  async create(@Body() lotData: CreateLotDto, @Req() request: { [key: string]: any }): Promise<LotResponse> {

    const { user } = request;

    return {
      resource: await this.lotsService.create(lotData, user), 
      meta: {} 
    };
  }
}
