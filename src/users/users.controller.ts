import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../entities/user';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get(':userId')
  async getUser(@Param('userId') userId ): Promise<User> {
    return await this.userService.findOneById(userId);
  }
}
