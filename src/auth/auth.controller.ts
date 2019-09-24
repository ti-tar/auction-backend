import {
  Controller, UsePipes, Get, Post, Body, UseGuards, Request, BadRequestException, UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { VadationPipe } from '../pipes/validation.pipe';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '../entities/user';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';
import { ConfigService } from '../shared/config.service';
import { LoggerService } from '../shared/logger.service';
import { ForgotUserDto } from './dto/forgot-user.dto';
import { ResetUserDto } from './dto/reset-user.dto';
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
    private readonly logger: LoggerService,
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

  @UsePipes(new VadationPipe())
  @UseInterceptors(SignUpSerializerInterceptor)
  @Post('signup')
  async singUp(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.authService.singUp(createUserDto);
  }

  @UsePipes(new VadationPipe())
  @UseInterceptors(LoginSerializerInterceptor)
  @Post('verify/email')
  async verifyEmail(@Body() verifyUserData: VerifyUserDto): Promise<{user: User, jwtToken: string}> {
    const user = await this.authService.verifyEmail(verifyUserData.token);
    return {
      user,
      jwtToken: this.configService.generateJWT(user),
    };
  }

  @Post('forgot_password')
  async forgotPassword(@Body() forgotData: ForgotUserDto) {

    const user = await this.userService.findByEmail(forgotData.email);

    if (!user) {
      throw new BadRequestException('No such email.');
    }

    if (user.status === 'pending') {
      throw new BadRequestException('You haven\'t been approved.');
    }

    const token = ConfigService.generateRandomToken();

    await this.userService.update(user, { token });

    // send an email with reset link
    const resetPassLink = this.configService.getResetPasswordLink(token);
    await this.emailService.sendEmail( {
      from: 'Auction Team <from@example.com>',
      to: user.email,
      subject: 'Email to reset password.',
      text: 'Hi! Reset pass on auction site. Your link: ' + `${resetPassLink}`,
      html: `<h1>Hi!</h1><p>Reset pass on auction site.</p><p><a href="${resetPassLink}">Reset email.</a></p>`,
    });

    return { message: 'Letter sent. Check your mailbox' };
  }

  @Post('reset_password')
  async resetPassword(@Body() resetData: ResetUserDto) {

    const { password, passwordConfirmation, token } = resetData;
    if (!password || !passwordConfirmation || (password !== passwordConfirmation)) {
      throw new BadRequestException('Passwords not equal');
    }

    const user = await this.userService.findByToken(token);

    if (!user) {
      throw new BadRequestException('No such user.');
    }

    if (user && user.status !== 'approved') {
      throw new BadRequestException('Your account was not approved.');
    }

    await this.userService.update(user, {
      password: ConfigService.getPasswordsHash('password'),
      token: null,
    });

    return { message: 'Password were reset successfully' };
  }

  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(UserProfileSerializerInterceptor)
  @Get('profile')
  async profile(@UserDecorator() user ): Promise<User> {
    return  this.userService.findOneById(user.id);
  }
}
