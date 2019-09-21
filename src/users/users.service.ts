import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository, DeleteResult } from 'typeorm';
// import { validate } from 'class-validator';
// import * as jwt from 'jsonwebtoken';
// import { SECRET } from '../config';
// import { throwErrorResponse } from '../libs/errors';
// entities
import { User } from '../entities/user';
// dto
import { LoginUserDto } from './dto/login-user.dto';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
// crypto
import * as crypto from 'crypto';
// interface
import { UserInterface } from './users.interface';
import { getPasswordsHash } from '../libs/helpers';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(loginUserDto: LoginUserDto): Promise<User> {
    const findOneOptions = {
      email: loginUserDto.email,
      password: getPasswordsHash(loginUserDto.password),
    };

    return await this.userRepository.findOne(findOneOptions);
  }

  async findOneById(id: number): Promise<User> {
    return await this.userRepository.findOne({ id });
  }

  async update(user: User, updatedData): Promise<User> {
    return await this.userRepository.save({ ...user, ...updatedData });
  }

  async create(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  async delete(email: string): Promise<DeleteResult> {
    return await this.userRepository.delete({ email });
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ email });
  }

  async findByToken(token: string): Promise<User> {
    return await this.userRepository.findOne({ token });
  }
}
