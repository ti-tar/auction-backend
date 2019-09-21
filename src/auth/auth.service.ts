import { Injectable, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { User } from '../entities/user';

// dto
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from '../users/dto/login-user.dto';

// services
import { UsersService } from '../users/users.service';

//
import { throwErrorResponse } from '../libs/errors';
import { getPasswordsHash } from '../libs/helpers';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user && user.password === getPasswordsHash(password)) {
      delete user.password;
      return user;
    }
    return null;
  }

  public async login(userData: LoginUserDto): Promise<User> {
    return await this.userService.findByEmail(userData.email);
  }

  async singUp(userSignUpData: CreateUserDto & {token: string}): Promise<User> {

    const { firstName, lastName, email, phone, password, token } = userSignUpData;

    // create new user
    const newUser = new User();
    newUser.firstName = firstName;
    newUser.lastName = lastName;
    newUser.email = email;
    newUser.phone = phone;
    newUser.password = password;
    newUser.token = token;

    const errors = await validate(newUser);

    if (errors.length > 0) {
      throwErrorResponse(errors);
    }

    try {
      return await this.userService.create(newUser);
    } catch ( errors ) {
      throw new BadRequestException('Error occurred while saving user!');
    }
  }
}
