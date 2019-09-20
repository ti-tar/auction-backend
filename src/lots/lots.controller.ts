import {
  Controller, Get, Put, Post, Body, UsePipes, Param, Req, Delete, Request,
  UseInterceptors, UploadedFile, HttpStatus, HttpException, UseGuards,
} from '@nestjs/common';
import { FileInterceptor, MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';
import * as sharp from 'sharp';
import * as fs from 'fs';

import { LotsService } from './lots.service';
import { BidsService } from './bids.service';

import { Lot } from '../entities/lot';
import { Bid } from '../entities/bid';
// pipes
import { VadationPipe } from '../pipes/validation.pipe';
import { LotEditValidation } from '../pipes/lot-edit.validation.pipe';
import { BidEditValidation } from '../pipes/bid-edit.validation.pipe';

// dto
import { CreateLotDto } from './dto/create-lot.dto';
import { CreateBidDto } from './dto/create-bid.dto';
import { DeleteResult } from 'typeorm';

import { extname } from 'path';
import { AuthGuard } from '@nestjs/passport';

interface LotsResponse {
  resources: Lot[];
  meta: object;
}

interface LotResponse {
  resource: Lot;
  meta: object;
}

interface BidResponse {
  resource: Bid;
  meta: object;
}

@Controller('lots')
export class LotsController {
  constructor(
    private readonly lotsService: LotsService,
    private readonly bidService: BidsService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(): Promise<LotsResponse> {
    const lots = await this.lotsService.findAll();
    return {
      resources: lots,
      meta: {},
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('own')
  async findOwnAll(@Req() request: { [key: string]: any }): Promise<LotsResponse> {
    const { user } = request;
    const lots = await this.lotsService.findAllByUserId(user.id);
    return {
      resources: lots,
      meta: {},
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':lotId')
  async find(@Param('lotId') lotId: number): Promise<LotResponse> {

    const lot: Lot =  await this.lotsService.find(lotId);
    return {
      resource: lot,
      meta: {},
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new VadationPipe(), new LotEditValidation())
  @Put(':lotId')
  async update(@Param('lotId') lotId: number, @Body() lotData: CreateLotDto): Promise<LotResponse> {

    // todo validation check jwt user id  === lot creator id
    const updatedLot = await this.lotsService.update(lotData, lotId);

    return {
      resource: updatedLot,
      meta: {},
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':lotId')
  async delete(@Param('lotId') lotId: number): Promise<DeleteResult> {
    const resp = await this.lotsService.delete(lotId);
    return resp;
  }

  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new VadationPipe(), new LotEditValidation())
  @Post()
  async create(@Body() lotData: CreateLotDto, @Req() request: { [key: string]: any }): Promise<LotResponse> {

    const { user } = request;

    return {
      resource: await this.lotsService.create(lotData, user),
      meta: {},
    };
  }

  @UseGuards(AuthGuard('jwt'))
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

  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new BidEditValidation())
  @Post(':lotId/bids')
  async addBid(
    @Param('lotId') lotId: number,
    @Body() bidData: CreateBidDto,
    @Req() request: { [key: string]: any },
  ): Promise<BidResponse> {

    const { user } = request;

    const lot: Lot = await this.lotsService.find(lotId);

    // todo check lotUserId !== userId

    if (!lot) {
      throw new HttpException([{message: 'Lot info error'}], HttpStatus.BAD_REQUEST);
    }

    if (!user) {
      throw new HttpException([{message: 'User auth error.'}], HttpStatus.UNAUTHORIZED);
    }

    const newBid = await this.bidService.create(bidData, user, lot );

    return {
      resource: newBid,
      meta: {},
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: multer.diskStorage({
      destination: './upload/images/lots',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        return cb(null, `${randomName}${extname(file.originalname)}`);
      },
    }),
  }))
  async uploadFile(@UploadedFile() file: any): Promise<{ fileName: string }> {
    // make thumb from uploaded, resize image to 200px width with sharp
    const filePath: string = file.path;
    const fileName: string = file.filename;
    const fullPath: string = `upload/images/lots/thumb/${fileName}`;
    const imageResult = await sharp(filePath)
    .resize(200)
    .toFile(fullPath, (err: any, info: any) => {
      if (err) {
        throw new HttpException({ message: err}, HttpStatus.BAD_REQUEST);
      }
    });

    return { fileName };
  }
}
