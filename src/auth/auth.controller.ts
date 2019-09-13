import {
  Controller, UsePipes,
  HttpException, HttpStatus,
  Get, Post, Body, Put, Param,
} from '@nestjs/common';

import { VadationPipe } from '../pipes/validation.pipe';
//  auth service
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { UserInterface } from '../users/users.interface';
import { User } from '../entities/user';

@Controller('auth')
export class AuthController {
  constructor(
    private  readonly  authService: AuthService,
  ) {}

  @UsePipes(new VadationPipe())
  @Post('singin')
  async singin(@Body() userData: CreateUserDto) {
    const savedUser = await this.authService.create(userData);
    return this.buildUserResponseObject(savedUser);
  }

  @UsePipes(new VadationPipe())
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<any> {

    const user = await this.authService.login(loginUserDto);

    return {
      resource: this.buildUserResponseObject(user),
      meta: {},
    };
  }

  private buildUserResponseObject(user: User): UserInterface {
    return {
      id: user.id,
      firstName: user.firstName,
      email: user.email,
      token: this.authService.generateJWT(user),
    };
  }
}
