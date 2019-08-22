import { HttpException, Controller, Get, Post, Body, Put, Param, UsePipes, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
// interface
import { UserInterface } from './users.interface';
// dto
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// decorator
import { UserJWT } from './user.decorator';
import { VadationPipe } from '../common/validation.pipe';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('user')
  async findMe(@UserJWT('email') email: string): Promise<UserInterface> {
    return await this.userService.findByEmail(email);
  }

  @Put('user')
  async update(@UserJWT('id') userId: number, @Body('user') userData: UpdateUserDto) {
    return await this.userService.update(userId, userData);
  }

  @UsePipes(new VadationPipe())
  @Post()
  async create(@Body() userData: CreateUserDto) {
    return this.userService.create(userData);
  }

  @Delete('users/:slug')
  async delete(@Param() params) {
    return await this.userService.delete(params.slug);
  }

  @Post('users/login')
  async login(@Body('user') loginUserDto: LoginUserDto): Promise<any> {
    const _user = await this.userService.findOne(loginUserDto);

    const errors = {User: ' not found'};
    if (!_user) throw new HttpException({errors}, 401);

    const token = await this.userService.generateJWT(_user);
    const {email, firstName, } = _user;
    const user = {email, token, firstName};
    return {user}
  }
}
