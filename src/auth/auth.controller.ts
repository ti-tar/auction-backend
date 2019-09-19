import {
  Controller, UsePipes, Get, Post, Body, UseGuards, Request, BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { VadationPipe } from '../pipes/validation.pipe';
import { randomBytes } from 'crypto';

import { CreateUserDto } from '../users/dto/create-user.dto';
import { ForgotUserDto } from './dto/forgot-user.dto';
import { ResetUserDto } from './dto/reset-user.dto';
import { UserInterface } from '../users/users.interface';
import { User } from '../entities/user';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';
import { ConfigService } from '../config/config.service';

interface UserResponseObject {
  resource: UserInterface;
  meta: {};
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Body() body): Promise<UserResponseObject> {
    const user = await this.userService.findByEmail(body.email);

    if (user.status !== 'approved') {
      throw new BadRequestException('Your email is not verified yet. Check your email and try again.');
    }

    // return user.status === 'approved' ? { ...response, token: this.authService.generateJWT(user) } : response;
    return {
      resource: {
        id: user.id,
        firstName: user.firstName,
        email: user.email,
        token: 'jwt_token',
      },
      meta: {},
    };
  }

  @Post('verify_email')
  async verifyEmail(@Body() body): Promise<User> {
    // get by token
    const user = await this.userService.findByToken(body.token);
    // check if user exists
    if (!user) {
      throw new BadRequestException('Invalid token.');
    }

    return await this.userService.update(user, {
      status: 'approved',
      token: null,
    });
  }

  @UsePipes(new VadationPipe())
  @Post('signup')
  async singup(@Body() userData: CreateUserDto) {
    const createdUser = await this.authService.singup(userData);
    const savedUser = await this.userService.findByEmail(createdUser.email);

    const token = randomBytes(32).toString('hex');

    const updatedUser = await this.userService.update(savedUser, { token });

    const verifyLink = `${this.configService.get('FRONTEND_URL')}auth/verify_email?token=${encodeURIComponent(updatedUser.token)}`;

    this.emailService.sendEmail( {
      from: 'Auction Team <from@example.com>',
      to: savedUser.email,
      subject: 'Letter to verify your registration',
      text: 'Hi! You receive this letter because you tried to register on auction site. Your link: ' + `${verifyLink}. If you didn't registered - skip this email.`,
      html: `<h1>Hi!</h1><p>You receive this letter because you tried to register on auction site.</p><p><a href="${verifyLink}">Verify email.</a></p><p>If you didn't registered - skip this email</p>`,
    });

    return {
      resource: this.buildUserResponseObject(savedUser),
      meta: {},
    };
  }

  @Post('forgot_password')
  async forgotPassword(@Body() forgotData: ForgotUserDto) {
    // check if user approved and email === body.email
    const user = await this.userService.findByEmail(forgotData.email);
    if (!user) {
      throw new BadRequestException('No such email or you haven\'t been approved.');
    }

    const token = randomBytes(32).toString('hex');
    const updatedUser = await this.userService.update(user, { token });

    const resetPassLink = `${this.configService.get('FRONTEND_URL')}auth/reset_email?token=${encodeURIComponent(token)}`;

    // send an email with reset link
    this.emailService.sendEmail( {
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
    // check if user approved and token === body.token

    console.log(resetData);

    // { token:
    //   'ef8e75d263e1cf063ec7ceeabe6f079a7a6f75d00ec79a2dc8946515ad0300ec',
    //     password: '1234',
    //   passwordConfirm: '1234'
    // }

    // reset password

    return '';
  }

  @UseGuards(AuthGuard())
  @Get('profile')
  profile(@Request() request ): User | null {
    return request.user;
  }

  private buildUserResponseObject(user: User): UserInterface {
    const response = {
      id: user.id,
      firstName: user.firstName,
      email: user.email,
      status: user.status,
    };
    return user.status === 'approved' ? { ...response, token: this.configService.generateJWT(user) } : response;
  }
}
