import { HttpException, HttpStatus, Controller, Get, Post, Body, Put, Param, UsePipes, Delete, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
// interface
import { UserInterface } from './users.interface';
import { User } from './../entities/user';
// dto
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// decorator
import { UserJWT } from './user.decorator';
import { VadationPipe } from '../pipes/validation.pipe';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  // @Get('user')
  // async findMe(@UserJWT('email') email: string): Promise<UserInterface> {
  //   const user = await this.userService.findByEmail(email);
  //   return this.buildUserResponseObject(user);
  // }

  // @Put('user')
  // async update(@UserJWT('id') userId: number, @Body('user') userData: UpdateUserDto) {
  //   return await this.userService.update(userId, userData);
  // }

  @Delete('users/:slug')
  async delete(@Param() params) {
    return await this.userService.delete(params.slug);
  }
}
