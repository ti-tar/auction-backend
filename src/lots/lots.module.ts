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
import { AuthMiddleware } from '../auth/auth.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([Lot, User, Bid])],
  providers: [
    LotsService,
    UsersService,
    BidsService,
  ],
  controllers: [
    LotsController
  ],
})

export class LotsModule implements NestModule {
  configure (customMiddlware: MiddlewareConsumer) {
    customMiddlware
      .apply(AuthMiddleware)
      .forRoutes(
        {
          path: 'lots',
          method: RequestMethod.GET
        },
        {
          path: 'lots/own',
          method: RequestMethod.GET
        },
        {
          path: 'lots/:id',
          method: RequestMethod.GET
        },
        {
          path: 'lots/:id/bids',
          method: RequestMethod.GET
        },
        {
          path: 'lots/:id/bids',
          method: RequestMethod.POST
        },
        {
          path: 'lots',
          method: RequestMethod.POST
        },
        {
          path: 'lots',
          method: RequestMethod.PUT
        }
      )
  }
}
