import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository, DeleteResult } from 'typeorm';
import { validate } from 'class-validator';
const jwt = require('jsonwebtoken');
import { SECRET } from '../config';
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

  async create(createUserDto: CreateUserDto): Promise<any> {

    // check uniqueness of username/email
    const { firstName, lastName, email, password } = createUserDto;
    const qb = await getRepository(User)
      .createQueryBuilder('user')
      .where('user.email = :email', { email });

    const user = await qb.getOne();

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
    newUser.password = password;

    const errors = await validate(newUser);

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

  async findById(id: number): Promise<any>{
    const user = await this.userRepository.findOne(id);

    if (!user) {
      const errors = {User: ' not found'};
      throw new HttpException({errors}, 401);
    };

    return this.buildUserRO(user);
  }

  async findByEmail(email: string): Promise<any>{
    const user = await this.userRepository.findOne({email: email});
    return this.buildUserRO(user);
  }

  public generateJWT(user) {
    let today = new Date();
    let exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign({
      id: user.id,
      username: user.username,
      email: user.email,
      exp: exp.getTime() / 1000,
    }, SECRET);
  };

  private buildUserRO(user: User) {
    const userRO = {
      username: user.firstName,
      email: user.email,
      token: this.generateJWT(user),
    };

    return {user: userRO};
  }
}
