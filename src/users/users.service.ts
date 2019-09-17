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
      password: crypto.createHmac('sha256', loginUserDto.password).digest('hex'),
    };

    return await this.userRepository.findOne(findOneOptions);
  }

  async findOneById(id: number): Promise<User> {
    return await this.userRepository.findOne({ id });
  }

  async setToken(user: User, token): Promise<User> {
    // todo ???
    return this.userRepository.save({ ...user,  token });
  }

  async create(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  // todo ?
  // async update(id: number, dto: UpdateUserDto): Promise<User> {
  //   const toUpdate = await this.userRepository.findOne(id);
  //   delete toUpdate.password;

  //   const updated = Object.assign(toUpdate, dto);
  //   return await this.userRepository.save(updated);
  // }

  async delete(email: string): Promise<DeleteResult> {
    return await this.userRepository.delete({ email });
  }

  // async findById(id: number): Promise<User> {
  //   const user = await this.userRepository.findOne(id);

  //   if (!user) {
  //     const errors = {User: ' not found'};
  //     throw new HttpException({errors}, 401);
  //   }

  //   return user;
  // }

  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ email });
  }
}
