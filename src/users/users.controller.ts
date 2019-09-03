import { HttpException, HttpStatus, Controller, Get, Post, Body, Put, Param, UsePipes, Delete } from '@nestjs/common';
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

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<any> {
    // console.log('loginUserDto');
    // console.log(loginUserDto);
    const user = await this.userService.findOne(loginUserDto);

    // console.log('user');
    // console.log(user);
    if (!user){
      throw new HttpException([{message: `Email or password are incorrect, or you are unregistered yet.`}], HttpStatus.UNAUTHORIZED);
    }

    const token = await this.userService.generateJWT(user);

    const {email, firstName } = user;

    return {
      resource: { email, firstName, token },
      meta: {}
    };
  }
}
