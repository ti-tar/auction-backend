import { Module, NestModule, MiddlewareConsumer, RequestMapping, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lot } from '../entities/lot';
import { LotsService } from '../lots/lots.service';
import { LotsController } from '../lots/lots.controller';

// middleware
import { AuthMiddleware } from '../auth/auth.middleware';
import { UsersService } from '../users/users.service';
import { User } from '../entities/user';

@Module({
  imports: [TypeOrmModule.forFeature([Lot, User])],
  providers: [
    LotsService,
    UsersService,
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
        }
      )
  }
}
