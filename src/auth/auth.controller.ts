import {
  Controller, UsePipes, Get, Post, Body, UseGuards, Request, BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { VadationPipe } from '../pipes/validation.pipe';
import { randomBytes } from 'crypto';

import { CreateUserDto } from '../users/dto/create-user.dto';
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

    return {
      resource: this.buildUserResponseObject(user),
      meta: {},
    };
  }

  @Post('verify_email')
  async verifyEmail(@Body() body ): Promise<User> {
    // get by token
    const user = await this.userService.findByToken(body.token);
    // set user status approved
    // return updated user
    return user;
  }

  @UsePipes(new VadationPipe())
  @Post('signup')
  async singup(@Body() userData: CreateUserDto) {
    const createdUser = await this.authService.singup(userData);
    const savedUser = await this.userService.findByEmail(createdUser.email);

    const token = randomBytes(32).toString('hex');

    const updatedUser = await this.userService.setToken(savedUser, token);

    const verifyLink = `${this.configService.get('FRONTEND_URL')}auth/verify_email?token=${encodeURIComponent(updatedUser.token)}`;

    this.emailService.sendEmail( {
      from: '"Bro Team" <from@example.com>',
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
    return user.status === 'approved' ? { ...response, token: this.authService.generateJWT(user) } : response;
  }
}
