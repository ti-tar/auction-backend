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
import { LoggerService } from '../shared/logger.service';
import { ConfigService } from '../shared/config.service';
import { JwtModule } from '@nestjs/jwt';
import { SECRET } from '../config';
import { LotsGateway } from './lots.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lot, User, Bid]),
    PassportModule,
    JwtModule.register({ secretOrPrivateKey: SECRET }),
  ],
  providers: [
    LotsService, UsersService, BidsService, LoggerService, ConfigService, LotsGateway,
  ],
  controllers: [LotsController],
})
export class LotsModule {}
