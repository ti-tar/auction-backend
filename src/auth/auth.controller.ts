import {
  Controller, UsePipes, Get, Post, Body, UseGuards, Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { VadationPipe } from '../pipes/validation.pipe';
import * as nodemailer from 'nodemailer';
//  auth service
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
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

  @UsePipes(new VadationPipe())
  @Post('signup')
  async singup(@Body() userData: CreateUserDto) {
    const savedUser = await this.authService.singup(userData);
    this.sendEmail(savedUser.email);
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

  private sendEmail(email: string): void {
    // according to https://blog.mailtrap.io/sending-emails-with-nodemailer/
    const transport = nodemailer.createTransport({
      host: 'smtp.mailtrap.io',
      port: 2525,
      auth: {
        // todo - from env config
        user: 'MAILTRIP_USER',
        pass: 'MAILTRIP_PASS',
      },
    });
    const mailOptions = {
      from: '"Example Team" <from@example.com>',
      to: 'vitalii.titarenko@brocoders.team',
      subject: 'Nice Nodemailer test',
      text: 'Hey there, it’s our first message sent with Nodemailer ;) ',
      html: '<b>Hey there! </b><br> This is our first message sent with Nodemailer',
    };

    transport.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Email sent: ' + info.response);
    });
  }
}
