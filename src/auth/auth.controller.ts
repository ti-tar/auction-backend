import {
  Controller, UsePipes, Get, Post, Body, UseGuards, Request, BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { VadationPipe } from '../pipes/validation.pipe';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ForgotUserDto } from './dto/forgot-user.dto';
import { ResetUserDto } from './dto/reset-user.dto';
import { UserInterface } from '../users/users.interface';
import { User } from '../entities/user';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';
import { ConfigService } from '../config/config.service';
import { getPasswordsHash } from '../libs/helpers';

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
        token: this.configService.generateJWT(user),
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
  async singUp(@Body() userSignUpData: CreateUserDto) {

    // check uniqueness of username/email
    const user = await this.userService.findByEmail(userSignUpData.email);
    if (user) {
      throw new BadRequestException('Email must be unique. Already registered.');
    }

    const createdUser = await this.authService.singUp({
      ...userSignUpData,
      token: this.configService.generateRandomToken(),
    });

    const verifyLink = this.configService.getVerifyLink(createdUser.token);

    this.emailService.sendEmail( {
      from: 'Auction Team <from@example.com>',
      to: createdUser.email,
      subject: 'Letter to verify your registration',
      text: 'Hi! To complete registration follow link: ' + `${verifyLink}`,
      html: `<h1>Hi!</h1><p>To complete registration follow link:</p><p><a href="${verifyLink}">Verify email.</a></p>`,
    });

    return {
      resource: this.buildUserResponseObject(createdUser),
      meta: {},
    };
  }

  @Post('forgot_password')
  async forgotPassword(@Body() forgotData: ForgotUserDto) {

    const user = await this.userService.findByEmail(forgotData.email);

    if (!user) {
      throw new BadRequestException('No such email.');
    }

    // check if user approved
    if (user.status === 'pending') {
      throw new BadRequestException('You haven\'t been approved.');
    }

    const token = this.configService.generateRandomToken();

    await this.userService.update(user, { token });

    // send an email with reset link
    const resetPassLink = this.configService.getResetPasswordLink(token);
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

    const { password, passwordConfirmation, token } = resetData;
    if (!password || !passwordConfirmation || (password !== passwordConfirmation)) {
      throw new BadRequestException('Passwords not equal');
    }

    // check if user approved and token === body.token
    const user = await this.userService.findByToken(token);

    if (!user) {
      throw new BadRequestException('No such user.');
    }

    if (user && user.status !== 'approved') {
      throw new BadRequestException('Your account was not approved.');
    }

    await this.userService.update(user, {
      password: getPasswordsHash('password'),
      token: null,
    });

    return { message: 'Password were reset successfully' };
  }

  @UseGuards(AuthGuard('jwt'))
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
