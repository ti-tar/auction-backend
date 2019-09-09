import {
  Controller, Get, Put, Post, Body, UsePipes, Param, Req, Delete, Request, UseInterceptors, UploadedFile,
} from '@nestjs/common';
import { FileInterceptor, MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';
import * as sharp from 'sharp';
import * as fs from 'fs';

import { LotsService } from './lots.service';
import { BidsService } from './bids.service';

import { Lot } from '../entities/lot';
import { Bid } from '../entities/bid';

import { VadationPipe } from '../common/validation.pipe';
import { CreateLotDto } from './create-lot.dto';
import { CreateBidDto } from './create-bid.dto';
import { UpdateLotDto } from './update-lot.dto';
import { DeleteResult } from 'typeorm';

import { extname } from 'path';

interface LotsResponse {
  resources: Lot[];
  meta: object;
}

interface LotResponse {
  resource: Lot;
  meta: object;
}

@Controller('lots')
export class LotsController {
  constructor(
    private readonly lotsService: LotsService,
    private readonly bidService: BidsService,
  ) {}

  @Get()
  async findAll(): Promise<LotsResponse> {
    const lots = await this.lotsService.findAll();
    return {
      resources: lots,
      meta: {},
    };
  }

  @Get('own')
  async findOwnAll(@Req() request: { [key: string]: any }): Promise<LotsResponse> {
    const { user } = request;
    const lots = await this.lotsService.findAllByUserId(user.id);
    return {
      resources: lots,
      meta: {},
    };
  }

  @Get(':lotId')
  async find(@Param('lotId') lotId: number): Promise<LotResponse> {

    const lot: Lot =  await this.lotsService.find(lotId);
    return {
      resource: lot,
      meta: {},
    };
  }

  @UsePipes(new VadationPipe())
  @Put(':lotId')
  async update(@Param('lotId') lotId: number, @Body() lotData: CreateLotDto): Promise<LotResponse> {

    // todo validation check jwt user id  === lot creator id

    const updatedLot = await this.lotsService.update(lotData, lotId);

    return {
      resource: updatedLot,
      meta: {},
    };
  }

  @Delete(':lotId')
  async delete(@Param('lotId') lotId: number): Promise<DeleteResult> {
    const resp = await this.lotsService.delete(lotId);
    return resp;
  }

  @UsePipes(new VadationPipe())
  @Post()
  async create(@Body() lotData: CreateLotDto, @Req() request: { [key: string]: any }): Promise<LotResponse> {

    const { user } = request;

    return {
      resource: await this.lotsService.create(lotData, user),
      meta: {},
    };
  }

  @Get(':lotId/bids')
  async findBidsById(@Param('lotId') lotId: number): Promise<any> {

    const bids: Bid[] = await this.bidService.findAllByLotId(lotId);
    const totalBids: number = await this.bidService.getBidsCountByLotId(lotId);

    return {
      resources: bids,
      meta: {
        total: totalBids,
      },
    };
  }

  @UsePipes(new VadationPipe())
  @Post(':lotId/bids')
  async addBid(
    @Param('lotId') lotId: number,
    @Body() bidData: CreateBidDto,
    @Req() request: { [key: string]: any },
  ): Promise<any> {

    const { user } = request;

    const lot: Lot = await this.lotsService.find(lotId);

    // todo check lotUserId !== userId

    const newBid = await this.bidService.create(bidData, user, lot );

    return {
      resource: newBid,
      meta: {},
    };
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: multer.diskStorage({
      destination: './upload/lots',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        return cb(null, `${randomName}${extname(file.originalname)}`);
      },
    }),
  }))
  async uploadFile(@UploadedFile() file: any): Promise<{ fileName: string }> {
    // resize image to 200px width with sharp
    const filePath: string = file.path;
    const imageResult = await sharp(filePath)
    .resize(200)
    .toBuffer()
    .then((data: any) => {
      fs.writeFileSync(file.fileName, data);
    })
    .catch( () => {
      // throw new HttpException({ message: 'Error occurred during handling image.'}, HttpStatus.BAD_REQUEST);
    });

    return { fileName: file.filename };
  }
}
