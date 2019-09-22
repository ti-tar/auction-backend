import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { LotsController } from './lots.controller';

import { Lot } from '../entities/lot';
import { User } from '../entities/user';
import { Bid } from '../entities/bid';

import { LotsService } from './lots.service';
import { UsersService } from '../users/users.service';
import { BidsService } from '../bids/bids.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lot, User, Bid]),
    PassportModule,
  ],
  providers: [LotsService, UsersService, BidsService],
  controllers: [
    LotsController,
  ],
})
export class LotsModule {}
