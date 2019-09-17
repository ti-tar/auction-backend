import {
  Controller, UsePipes, Get, Post, Body, UseGuards, Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { VadationPipe } from '../pipes/validation.pipe';
import { randomBytes } from 'crypto';

import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserInterface } from '../users/users.interface';
import { User } from '../entities/user';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';

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

  @UsePipes(new VadationPipe())
  @Post('signup')
  async singup(@Body() userData: CreateUserDto) {
    const createdUser = await this.authService.singup(userData);
    const savedUser = await this.userService.findByEmail(createdUser.email);

    const token = randomBytes(32).toString('hex');

    const updatedUser = await this.userService.setToken(savedUser, token);

    const verifyLink = `http://localhost:3000/users/verify?token=${encodeURIComponent(updatedUser.token)}`;

    this.emailService.sendEmail( {
      from: '"Bro Team" <from@example.com>',
      to: savedUser.email,
      subject: 'Letter to verify your registration',
      text: `Hi! You receive this letter because you tried to register auction site. Your link: ${verifyLink}`,
      html: `<h1>Hi!</h1><p>You receive this letter because you tried to register auction site.</p><p><a href="${verifyLink}">Verify email.</a></p>`,
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
    return {
      id: user.id,
      firstName: user.firstName,
      email: user.email,
      token: this.authService.generateJWT(user),
    };
  }
}
