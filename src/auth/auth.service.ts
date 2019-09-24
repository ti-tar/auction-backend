import { Injectable, BadRequestException, Body, UseInterceptors } from '@nestjs/common';
import { User } from '../entities/user';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { ConfigService } from '../shared/config.service';
import { LoginSerializerInterceptor } from './serializers/login.interceptor';
import { LoggerService } from '../shared/logger.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
    private readonly loggerService: LoggerService,
    private readonly emailService: EmailService,
  ) {}

  @UseInterceptors(LoginSerializerInterceptor)
  async loginUser(loginUserDto): Promise<User> {
    const user = await this.userService.findByEmail(loginUserDto.email);

    if (user.status !== 'approved') {
      throw new BadRequestException('Your email is not verified yet. Check your email and try again.');
    }

    return user;
  }

  async singUp(createUserDto: CreateUserDto): Promise<User> {

    if (await this.userService.findByEmail(createUserDto.email)) {
      throw new BadRequestException('Email must be unique. Already registered.');
    }

    try {
      const newUser = new User();
      newUser.firstName = createUserDto.firstName;
      newUser.lastName = createUserDto.lastName;
      newUser.email = createUserDto.email;
      newUser.phone = createUserDto.phone;
      newUser.password = createUserDto.password;

      await this.userService.save(newUser);
      this.loggerService.log(`New User id ${newUser.id} '${newUser.firstName}'[${newUser.email}] Signed Up!`);

      const sentMail = await this.emailService.sendVerificationEmail(newUser);
      this.loggerService.log(`Verification Email to ${sentMail.envelope.to.join(', ')} sent.`);

      return newUser;

    } catch ( errors ) {
      this.loggerService.error(errors);
      throw new BadRequestException('Error occurred while saving user!');
    }
  }

  async verifyEmail(token: string): Promise<User> {

    const user = await this.userService.findByToken(token);
    if (!user) {
      throw new BadRequestException('Invalid token.');
    }

    try {
      const updatedUser = await this.userService.update(user, {
        status: 'approved',
        token: null,
      });
      this.loggerService.log(`User '${updatedUser.firstName}' id ${updatedUser.id} approved.`);

      const sentMail = await this.emailService.sendApprovalEmail(updatedUser);
      this.loggerService.log(`Email verified. Success letter sent to ${sentMail.envelope.to.join(', ')}`);
      return updatedUser;
    } catch ( errors ) {
      this.loggerService.error(errors);
      throw new BadRequestException('Error occurred while approving user!');
    }
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user && user.password === ConfigService.getPasswordsHash(password)) {
      delete user.password;
      return user;
    }
    return null;
  }
}
