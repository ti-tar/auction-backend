import { Injectable, BadRequestException, UseInterceptors } from '@nestjs/common';
import { User } from '../entities/user';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { ConfigService } from '../shared/config.service';
import { LoginSerializerInterceptor } from './serializers/login.interceptor';
import { LoggerService } from '../shared/logger.service';
import { EmailService } from '../emails/email.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
    private readonly loggerService: LoggerService,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
  ) {}

  @UseInterceptors(LoginSerializerInterceptor)
  async loginUser(loginUserDto: LoginUserDto): Promise<User> {
    const user = await this.userService.findByEmail(loginUserDto.email);

    if (!user) {
      throw new BadRequestException('User doesn\'t exist');
    }

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
      this.loggerService.log(`User Signed Up. User '${newUser.firstName}', id: ${newUser.id}, email: ${newUser.email},  status: ${newUser.status}`);

      const sentMail = await this.emailService.sendVerificationEmail(newUser);
      this.loggerService.log(`User Signed Up. Verification email sent to ${sentMail.envelope.to.join(', ')}`);

      return newUser;

    } catch ( errors ) {
      this.loggerService.error(errors);
      throw new BadRequestException('Error occurred during saving user!');
    }
  }

  async verifyEmail(token: string): Promise<User> {

    const user = await this.userService.findByToken(token);
    if (!user) {
      throw new BadRequestException('Invalid token.');
    }

    try {
      user.status = 'approved';
      user.token = null;
      await this.userService.update(user);
      this.loggerService.log(`Email verified. User '${user.firstName}', id: ${user.id}, email: ${user.email}, status: ${user.status}.`);

      const sentMail = await this.emailService.sendApprovalEmail(user);
      this.loggerService.log(`Email verified. Success letter sent to ${sentMail.envelope.to.join(', ')}`);

      return user;
    } catch ( errors ) {
      this.loggerService.error(errors);
      throw new BadRequestException('Error occurred while approving user!');
    }
  }

  async forgotPassword(forgotUserDto: ForgotPasswordDto): Promise<User> {

    const user = await this.userService.findByEmail(forgotUserDto.email);

    if (!user) {
      throw new BadRequestException('No such email.');
    }

    if (user.status === 'pending') {
      throw new BadRequestException('You haven\'t been approved.');
    }

    user.token = ConfigService.generateRandomToken();
    await this.userService.update(user);
    this.loggerService.log(`Forgot password. User '${user.firstName}', id: ${user.id}, email: ${user.email}, status: ${user.status}.`);
    try {
      const sentMail = await this.emailService.sendForgotPasswordMail(user);
      this.loggerService.log(`Forgot password. Email sent to ${sentMail.envelope.to.join(', ')}`);
      return user;
    } catch (error) {
      this.loggerService.error(error);
      throw new BadRequestException('Error occurred while updating!');
    }
  }

  async resetPassword(resetUserDto: ResetPasswordDto): Promise<User> {
    const { password, passwordConfirm, token } = resetUserDto;
    if (password !== passwordConfirm) {
      throw new BadRequestException('Passwords should not be equal');
    }

    const user = await this.userService.findByToken(token);

    if (!user) {
      throw new BadRequestException('No user with such token.');
    }

    if (user && user.status !== 'approved') {
      throw new BadRequestException('Your account was not been approved.');
    }

    try {
      user.password = ConfigService.getPasswordsHash(password);
      user.token = null;
      await this.userService.update(user);
      this.loggerService.log(`Reset password. User '${user.firstName}', id: ${user.id}, email: ${user.email}, status: ${user.status}.`);

      return user;
    } catch (error) {
      this.loggerService.error(error);
      throw new BadRequestException('Error occurred during resetting password!');
    }
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findByEmail(email);
    if (user && user.password === ConfigService.getPasswordsHash(password)) {
      return user;
    }
    this.loggerService.error(`Failed login attempt. Email: ${email}`);
    return null;
  }

  generateJWT(user: User) {
    return this.jwtService.sign({
      id: user.id,
      firstName: user.firstName,
      email: user.email,
      exp: ((new Date()).getTime() + this.configService.config.jwt.expirationTime * 1000) / 1000,
    });
  }
}
