import {
  Controller, UsePipes, Post, Body, UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'
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

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<any> {
    const user = await this.authService.login(loginUserDto);

    console.log(loginUserDto);

    return {
      resource: this.buildUserResponseObject(user),
      meta: {},
    };
  }

  @UsePipes(new VadationPipe())
  @Post('signin')
  async singin(@Body() userData: CreateUserDto) {
    const savedUser = await this.authService.create(userData);
    return {
      resource: this.buildUserResponseObject(savedUser),
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
