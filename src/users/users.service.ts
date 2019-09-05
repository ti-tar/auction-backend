import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository, DeleteResult } from 'typeorm';
import { validate } from 'class-validator';
const jwt = require('jsonwebtoken');
import { SECRET } from '../config';
import { throwErrorResponse } from '../libs/errors';
// entities
import { User } from '../entities/user';
// dto
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// crypto
import * as crypto from 'crypto';
// interface
import { UserInterface } from './users.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(loginUserDto: LoginUserDto): Promise<User> {
    const findOneOptions = {
      email: loginUserDto.email,
      password: crypto.createHmac('sha256', loginUserDto.password).digest('hex'),
    };

    return await this.userRepository.findOne(findOneOptions);
  }

  async findOneById(id: number): Promise<User> {
    return await this.userRepository.findOne({ id });
  };

  async create(createUserDto: CreateUserDto): Promise<any> {

    // check uniqueness of username/email
    const { firstName, lastName, email, phone, password } = createUserDto;

    const user = await getRepository(User)
      .createQueryBuilder('users')
      .where('users.email = :email', { email })
      .getOne();

    if (user) {
     
      // todo --- with DTO ???
      throw new HttpException([
        {
          property: 'email',
          message: 'Email must be unique. Already registered.'
        }
      ], HttpStatus.BAD_REQUEST);
    }

    // create new user
    let newUser = new User();
    newUser.firstName = firstName;
    newUser.lastName = lastName;
    newUser.email = email;
    newUser.phone = phone;
    newUser.password = password;

    const errors = await validate(newUser);

    if (errors.length > 0){
      // todo --- with DTO ???
      throwErrorResponse(errors);
    } 

    try {
      const savedUser = await this.userRepository.save(newUser);
      return savedUser;
    } catch ( errors ) {
      // console.log(errors);
      throw new HttpException({message: 'Error occured while saving user!'}, HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    let toUpdate = await this.userRepository.findOne(id);
    delete toUpdate.password;

    let updated = Object.assign(toUpdate, dto);
    return await this.userRepository.save(updated);
  }

  async delete(email: string): Promise<DeleteResult> {
    return await this.userRepository.delete({ email: email});
  }

  // async findById(id: number): Promise<any>{
  //   const user = await this.userRepository.findOne(id);

  //   if (!user) {
  //     const errors = {User: ' not found'};
  //     throw new HttpException({errors}, 401);
  //   };

  //   return user;
  // }

  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ email });
  }

  public generateJWT(user: User) {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign({
      id: user.id,
      firstName: user.firstName,
      email: user.email,
      exp: exp.getTime() / 1000,
    }, SECRET);
  }
}
