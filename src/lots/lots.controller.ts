import {
  Controller, Get, Put, Post, Body, Param, Delete, Request,
  UseInterceptors, UploadedFile, UseGuards, ParseIntPipe,
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
import { LotSerializerInterceptor } from './serializers/lot.interceptor';
import { BidsSerializerInterceptor } from '../bids/serializers/bids.interceptor';
import { BidSerializerInterceptor } from '../bids/serializers/bid.interceptor';
import { ImageUploadSerializerInterceptor } from '../images/serializers/image-upload.interceptor';
import { UserDecorator, IUserDecorator } from '../users/user.decorator';
import { LotEditValidationPipe } from '../pipes/lot-edit.validation.pipe';
import { ConfigService } from '../shared/config.service';
import { Pagination } from '../shared/pagination';
import { ImagesService } from '../images/images.service';
import { OrdersService } from '../orders/orders.service';
import { OrderDto } from '../orders/dto/order.dto';
import { Order } from '../entities/order';
import { OrderSerializerInterceptor } from '../orders/serializers/order.interceptor';

@Controller('lots')
export class LotsController {
  constructor(
    private readonly lotsService: LotsService,
    private readonly bidService: BidsService,
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
    private readonly imagesService: ImagesService,
    private readonly ordersService: OrdersService,
  ) {}

  /*
  * lots index page
  * get lots: status in InProcess, paginating params in @Request() request
  * response serialisation in LotsSerializerInterceptor
  * */
  // @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(LotsSerializerInterceptor)
  @Get()
  async getAllLots(@Request() request): Promise<Pagination<Lot>> {
    return this.lotsService.findAndCountLotsInProcess({
      page: request.query.page || this.configService.config.pagination.page,
    });
  }

  /*
  * auth user own lots page
  * get lots: lot.user.id == jwt.user.id, paginating params in @Request() request
  * response serialisation in LotsSerializerInterceptor
  * */
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(LotsSerializerInterceptor)
  @Get('own/lots')
  async getAllLotsByUserId(@UserDecorator() user: User, @Request() request): Promise<Pagination<Lot>> {
    return this.lotsService.findAndCountLotsByUserId(user.id, {
      page: request.query.page || this.configService.config.pagination.page,
    });
  }

  /*
  * user bidded lots page
  * get lots: lot.bids.user.id == jwt.user.id, paginating params in @Request() request
  * response serialisation in LotsSerializerInterceptor
  * */
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(LotsSerializerInterceptor)
  @Get('own/bids')
  async getAllLotsByBidUserId(@UserDecorator() user: IUserDecorator, @Request() request): Promise<Pagination<Lot>> {
    return this.lotsService.findAndCountLotsByBidUserId(user.id, {
      page: request.query.page || this.configService.config.pagination.page,
    });
  }

  // @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(LotSerializerInterceptor)
  @Get(':lotId')
  async getLotById(@Param('lotId', new ParseIntPipe()) lotId: number): Promise<Lot> {
    return this.lotsService.findOne(lotId);
  }

  // @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(BidsSerializerInterceptor)
  @Get(':lotId/bids')
  async getBidsByLotId(@Param('lotId', new ParseIntPipe()) lotId: number): Promise<[Bid[], number]> {
    return await this.bidService.findAllBidsByLotId(lotId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':lotId')
  async delete(@Param('lotId') lotId: number): Promise<DeleteResult> {
    return this.lotsService.delete(lotId);
  }

  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(LotSerializerInterceptor)
  @Post()
  async create(
    @Body(new ValidationPipe(), new LotEditValidationPipe()) lotData: CreateLotDto,
    @UserDecorator() user: User,
  ): Promise<Lot> {
    return this.lotsService.create(lotData, user);
  }

  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(LotSerializerInterceptor)
  @Put(':lotId')
  async update(
    @Param('lotId') lotId: number,
    @Body(new ValidationPipe(), new LotEditValidationPipe()) lotData: CreateLotDto,
    @UserDecorator() user,
  ): Promise<Lot> {
    return this.lotsService.update(lotId, lotData, user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':lotId/set')
  async setLot(@Param('lotId', new ParseIntPipe()) lotId: number, @UserDecorator() user): Promise<Lot> {
    return await this.lotsService.setLotToAuction(lotId, user);
  }

  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(OrderSerializerInterceptor)
  @Post(':lotId/order')
  async createOrder(
    @Param('lotId', new ParseIntPipe()) lotId: number,
    @Body(new ValidationPipe()) orderDto: OrderDto,
    @UserDecorator() user,
  ): Promise<Order> {
    return await this.ordersService.create(lotId, orderDto, user);
  }

  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(OrderSerializerInterceptor)
  @Put(':lotId/order')
  async updateOrder(
    @Param('lotId', new ParseIntPipe()) lotId: number,
    @Body(new ValidationPipe()) orderDto: OrderDto,
    @UserDecorator() user,
  ): Promise<Order> {
    return await this.ordersService.update(lotId, orderDto, user);
  }

  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(LotSerializerInterceptor)
  @Post(':lotId/executeOrder')
  async executeOrder(
    @Param('lotId', new ParseIntPipe()) lotId: number,
    @UserDecorator() user,
  ): Promise<Lot> {
    return await this.ordersService.executeOrder(lotId, user);
  }

  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(LotSerializerInterceptor)
  @Post(':lotId/receiveOrder')
  async receiveOrder(
    @Param('lotId', new ParseIntPipe()) lotId: number,
    @UserDecorator() user,
  ): Promise<Lot> {
    return await this.ordersService.receiveOrder(lotId, user);
  }

  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(BidSerializerInterceptor)
  @Post(':lotId/bids')
  async addBid(
    @Param('lotId', new ParseIntPipe()) lotId: number,
    @Body( new ValidationPipe() ) bidData: CreateBidDto,
    @UserDecorator() user: User,
  ): Promise<Bid> {
    return this.bidService.addBid(await this.lotsService.findOne(lotId), bidData, user);
  }

  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ImageUploadSerializerInterceptor)
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
  async uploadFile(@UploadedFile() file, @UserDecorator() user: User): Promise<sharp.OutputInfo  & { filename: string }> {
    return this.imagesService.resize(file, user);
  }
}
