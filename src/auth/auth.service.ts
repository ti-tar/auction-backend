import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { createHmac } from 'crypto';
import { validate } from 'class-validator';
import { User } from '../entities/user';

// dto
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from '../users/dto/login-user.dto';

// services
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
//
import { throwErrorResponse } from '../libs/errors';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user && user.password === createHmac('sha256', password).digest('hex')) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  public async login(userData: LoginUserDto): Promise<User> {
    return await this.userService.findByEmail(userData.email);
  }

  async singup(createUserDto: CreateUserDto): Promise<any> {

    // check uniqueness of username/email
    const { firstName, lastName, email, phone, password } = createUserDto;

    const user = await this.userService.findByEmail(email);

    // check email hasn't been registered yet
    if (user) {
      throw new HttpException([
        {
          property: 'email',
          message: 'Email must be unique. Already registered.',
        },
      ], HttpStatus.BAD_REQUEST);
    }

    // create new user
    const newUser = new User();
    newUser.firstName = firstName;
    newUser.lastName = lastName;
    newUser.email = email;
    newUser.phone = phone;
    newUser.password = password;

    const errors = await validate(newUser);

    if (errors.length > 0) {
      throwErrorResponse(errors);
    }

    try {
      const savedUser = await this.userService.create(newUser);
      return savedUser;
    } catch ( errors ) {
      throw new HttpException({message: 'Error occured while saving user!'}, HttpStatus.BAD_REQUEST);
    }
  }

  public generateJWT(user: User) {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return this.jwtService.sign({
      id: user.id,
      firstName: user.firstName,
      email: user.email,
      exp: exp.getTime() / 1000,
    });
  }
}
