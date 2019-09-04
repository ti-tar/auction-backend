import { 
  Controller, Get, Put, Post, Body, UsePipes, Param, Req, Request, UseInterceptors, ClassSerializerInterceptor
} from '@nestjs/common';

import { Transform } from 'class-transformer';

import { LotsService } from './lots.service';
import { BidsService } from './bids.service';

import { Lot } from '../entities/lot';
import { Bid } from '../entities/bid';

import { VadationPipe } from '../common/validation.pipe';
import { CreateLotDto } from './create-lot.dto';
import { CreateBidDto } from './create-bid.dto';
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
  constructor(
    private readonly lotsService: LotsService,
    private readonly bidService: BidsService
  ) {}

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


  @Get(':lotId/bids')
  findBidsById(@Param('lotId') lotId: number): any {

    return {
      resource: '', 
      meta: {} 
    };
  }

  @UsePipes(new VadationPipe())
  @Post(':lotId/bids')
  async addBid(
    @Param('lotId') lotId: number, 
    @Body() bidData: CreateBidDto, 
    @Req() request: { [key: string]: any }
  ): Promise<any> {

    const { user } = request;

    const lot: Lot = await this.lotsService.find(lotId);

    // todo check lotUserId !== userId

    const newBid = await this.bidService.create(bidData, user, lot );
  
    return {
      resource: newBid, 
      meta: {} 
    };
  }
}
