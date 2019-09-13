import { Module, NestModule, MiddlewareConsumer, RequestMapping, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LotsController } from '../lots/lots.controller';
//
import { Lot } from '../entities/lot';
import { User } from '../entities/user';
import { Bid } from '../entities/bid';
//
import { LotsService } from '../lots/lots.service';
import { UsersService } from '../users/users.service';
import { BidsService } from '../lots/bids.service';

// middleware
import { AuthMiddleware } from '../middlewares/auth.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([Lot, User, Bid])],
  providers: [
    LotsService,
    UsersService,
    BidsService,
  ],
  controllers: [
    LotsController,
  ],
})

export class LotsModule implements NestModule {
  configure(customMiddlware: MiddlewareConsumer) {
    customMiddlware
    .apply(AuthMiddleware)
    .forRoutes(
      {
        path: 'lots',
        method: RequestMethod.GET,
      },
      {
        path: 'lots/own',
        method: RequestMethod.GET,
      },
      // get lot by id
      {
        path: 'lots/:id',
        method: RequestMethod.GET,
      },
      // lot create
      {
        path: 'lots',
        method: RequestMethod.POST,
      },
      // lot update
      {
        path: 'lots/:lotId',
        method: RequestMethod.PUT,
      },
      // lot delete
      {
        path: 'lots/:lotId',
        method: RequestMethod.DELETE,
      },
      // bids list by id
      {
        path: 'lots/:lotId/bids',
        method: RequestMethod.GET,
      },
      // bids add new bid
      {
        path: 'lots/:lotId/bids',
        method: RequestMethod.POST,
      },
      // upload image
      // {
      //   path: 'lots/upload',
      //   method: RequestMethod.POST,
      // },
    );
  }
}
