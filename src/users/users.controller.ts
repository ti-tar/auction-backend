import { HttpException, HttpStatus, Controller, Get, Post, Body, Put, Param, UsePipes, Delete } from '@nestjs/common';
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

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  // @Get('user')
  // async findMe(@UserJWT('email') email: string): Promise<UserInterface> {
  //   const user = await this.userService.findByEmail(email);
  //   return this.buildUserResponseObject(user);
  // }

  @Put('user')
  async update(@UserJWT('id') userId: number, @Body('user') userData: UpdateUserDto) {
    return await this.userService.update(userId, userData);
  }

  @UsePipes(new VadationPipe())
  @Post()
  async create(@Body() userData: CreateUserDto) {
    const savedUser = await this.userService.create(userData);
    return this.buildUserResponseObject(savedUser);
  }

  @Delete('users/:slug')
  async delete(@Param() params) {
    return await this.userService.delete(params.slug);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<any> {

    const user = await this.userService.findOne(loginUserDto);

    if (!user) {
      throw new HttpException([{message: `Email or password are incorrect, or you are unregistered yet.`}], HttpStatus.UNAUTHORIZED);
    }

    const token = await this.userService.generateJWT(user);

    const {id, email, firstName } = user;

    return {
      resource: { id, email, firstName, token },
      meta: {},
    };
  }

  private buildUserResponseObject(user: User): {user: UserInterface} {
    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        email: user.email,
        token: this.userService.generateJWT(user),
      },
    };
  }
}
