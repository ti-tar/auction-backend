import {
  Controller, UsePipes, Get, Post, Body, UseGuards, Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'
import { VadationPipe } from '../pipes/validation.pipe';
//  auth service
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { UserInterface } from '../users/users.interface';
import { User } from '../entities/user';
import { UsersService } from '../users/users.service';

interface UserResponseObject {
  resource: UserInterface;
  meta: {};
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() request): Promise<UserResponseObject> {
    const user = await this.userService.findByEmail(request.body.email);
    return {
      resource: this.buildUserResponseObject(user),
      meta: {},
    };
  }

  // @UsePipes(new VadationPipe())
  @Post('signin')
  async singin(@Body() userData: CreateUserDto) {
    const savedUser = await this.authService.create(userData);
    return {
      resource: this.buildUserResponseObject(savedUser),
      meta: {},
    };
  }

  @UseGuards(AuthGuard())
  @Get('profile')
  profile(@Request() request ): User | null {
    return request.user;
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
