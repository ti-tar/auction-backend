import {
  Controller, Get, Put, Post, Body, UsePipes, Param, Delete,
  UseInterceptors, UploadedFile, UseGuards, BadRequestException, ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import * as sharp from 'sharp';
import * as uuid from 'uuid/v4';
import { LotsService } from './lots.service';
import { BidsService } from '../bids/bids.service';
import { Lot } from '../entities/lot';
import { Bid } from '../entities/bid';
import { User } from '../entities/user';
import { ValidationPipe } from '../pipes/validation.pipe';
import { CreateLotDto } from './dto/create-lot.dto';
import { CreateBidDto } from '../bids/dto/create-bid.dto';
import { DeleteResult } from 'typeorm';
import { extname } from 'path';
import { AuthGuard } from '@nestjs/passport';
import { LoggerService } from '../shared/logger.service';
import { LotsSerializerInterceptor } from './serializers/lots.interceptor';
import { BidsSerializerInterceptor } from '../bids/serializers/bids.interceptor';
import { UserDecorator } from '../users/user.decorator';
import { LotEditValidationPipe } from '../pipes/lot-edit-validation-pipe.service';

@Controller('lots')
export class LotsController {
  constructor(
    private readonly lotsService: LotsService,
    private readonly bidService: BidsService,
    private readonly loggerService: LoggerService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(LotsSerializerInterceptor)
  @Get()
  async findAll(): Promise<Lot[]> {
    return this.lotsService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(LotsSerializerInterceptor)
  @Get('own/bids')
  async findLotsWithOwnBids(@UserDecorator() user: User): Promise<Lot[]> {
    return this.lotsService.findLotsByBidUserId(user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(LotsSerializerInterceptor)
  @Get('own/lots')
  async findOwnLots(@UserDecorator() user: User): Promise<Lot[]> {
    return this.lotsService.findAllByUserId(user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(LotsSerializerInterceptor)
  @Get(':lotId')
  async find(@Param('lotId', new ParseIntPipe()) lotId: number): Promise<Lot> {
    return this.lotsService.find(lotId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':lotId/bids')
  async findBidsById(@Param('lotId', new ParseIntPipe()) lotId: number): Promise<any> {
    return {
      resources: await this.bidService.findAllByLotId(lotId),
      meta: {
        total: await this.bidService.getBidsCountByLotId(lotId),
      },
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':lotId')
  async delete(@Param('lotId') lotId: number): Promise<DeleteResult> {
    return this.lotsService.delete(lotId);
  }

  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(LotsSerializerInterceptor)
  @Put(':lotId')
  async update(
    @Param('lotId') lotId: number,
    @Body(new ValidationPipe(), new LotEditValidationPipe()) lotData: CreateLotDto,
    @UserDecorator() user,
  ): Promise<Lot> {
    return this.lotsService.update(lotId, lotData, user);
  }

  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(LotsSerializerInterceptor)
  @Post()
  async create(
    @Body(new ValidationPipe(), new LotEditValidationPipe()) lotData: CreateLotDto,
    @UserDecorator() user: User,
  ): Promise<Lot> {
    return this.lotsService.create(lotData, user);
  }

  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(BidsSerializerInterceptor)
  @Post(':lotId/bids')
  async addBid(
    @Param('lotId') lotId: number,
    @Body( new ValidationPipe() ) bidData: CreateBidDto,
    @UserDecorator() user: User,
  ): Promise<Bid> {
    const lot = await this.lotsService.find(lotId);
    return this.bidService.addBid(bidData, user, lot);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('upload')
  @UseInterceptors(
    FileInterceptor(
      'file',
      {
        storage: multer.diskStorage({
          destination: './upload/images/lots',
          filename: (req, file, callback) => {
            return callback(null, `${uuid()}${extname(file.originalname)}`);
          },
        }),
      },
    ),
  )
  async uploadFile(@UploadedFile() file, @UserDecorator() user: User): Promise<{ fileName: string }> {
    const fullPath: string = `upload/images/lots/thumb/${file.filename}`;
    try {
      const {width, height, size}: sharp.OutputInfo = await sharp(file.path).resize(200).toFile(fullPath);
      this.loggerService.log(`Upload File. User: id ${user.id}, ${user.firstName}. File '${file.filename}' thumbed to${width}x${height} ${size}b!`);
    } catch (error) {
      this.loggerService.error(error);
      throw new BadRequestException('Error during saving image.');
    }
    return { fileName: file.filename };
  }
}
