import {
  Controller, UsePipes, Get, Post, Body, UseGuards, Request, BadRequestException, UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ValidationPipe } from '../pipes/validation.pipe';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '../entities/user';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';
import { ConfigService } from '../shared/config.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { VerifyUserDto } from './dto/verify-user.dto';
import { LoginSerializerInterceptor } from './serializers/login.interceptor';
import { SignUpSerializerInterceptor } from './serializers/signup.interceptor';
import { UserDecorator } from '../users/user.decorator';
import { UserProfileSerializerInterceptor } from './serializers/user-profile.interceptor';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  @UseGuards(AuthGuard('local'))
  @UseInterceptors(LoginSerializerInterceptor)
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<{user: User, jwtToken: string}> {
    const user = await this.authService.loginUser(loginUserDto);
    return {
      user,
      jwtToken: this.configService.generateJWT(user),
    };
  }

  @UsePipes(new ValidationPipe())
  @UseInterceptors(SignUpSerializerInterceptor)
  @Post('signup')
  async singUp(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.authService.singUp(createUserDto);
  }

  // @UsePipes(new ValidationPipe())
  @UseInterceptors(LoginSerializerInterceptor)
  @Post('verify/email')
  async verifyEmail(@Body() verifyUserData: VerifyUserDto): Promise<{user: User, jwtToken: string}> {
    const user = await this.authService.verifyEmail(verifyUserData.token);
    return {
      user,
      jwtToken: this.configService.generateJWT(user),
    };
  }

  @UsePipes(new ValidationPipe())
  @Post('forgot_password')
  async forgotPassword(@Body() forgotData: ForgotPasswordDto): Promise<{ message: string }> {
    await this.authService.forgotPassword(forgotData);
    return { message: 'Letter sent. Check your mailbox' };
  }

  @UsePipes(new ValidationPipe())
  @Post('reset_password')
  async resetPassword(@Body() resetUserDto: ResetPasswordDto): Promise<{ message: string }> {
    await this.authService.resetPassword(resetUserDto);
    return { message: 'Password was reset successfully' };
  }

  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(UserProfileSerializerInterceptor)
  @Get('profile')
  async profile(@UserDecorator() user ): Promise<User> {
    return this.userService.findOneById(user.id);
  }
}
