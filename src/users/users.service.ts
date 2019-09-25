import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, UpdateResult } from 'typeorm';
import { User } from '../entities/user';
import { LoginUserDto } from '../auth/dto/login-user.dto';
import { ConfigService } from '../shared/config.service';

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
      password: ConfigService.getPasswordsHash(loginUserDto.password),
    };

    return await this.userRepository.findOne(findOneOptions);
  }

  async findOneById(id: number): Promise<User> {
    return await this.userRepository.findOne({ id });
  }

  async update(user: User): Promise<UpdateResult> {
    return await this.userRepository.update(user.id, user);
  }

  async save(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  async delete(email: string): Promise<DeleteResult> {
    return await this.userRepository.delete({ email });
  }

  async login(email: string): Promise<User> {
    return await this.findByEmail(email);
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ email });
  }

  async findByToken(token: string): Promise<User> {
    return await this.userRepository.findOne({ token });
  }
}
