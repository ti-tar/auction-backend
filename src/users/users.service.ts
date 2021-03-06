import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { User } from '../entities/user';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(options = {}): Promise<User[]> {
    return await this.userRepository.find(options);
  }

  async findOne(options = {}): Promise<User> {
    return await this.userRepository.findOne(options);
  }

  async findOneById(id: number): Promise<User> {
    return await this.userRepository.findOne(id);
  }

  async update(user: User): Promise<UpdateResult> {
    return await this.userRepository.update(user.id, user);
  }

  async save(user: User | {[key: string]: any}): Promise<User> {
    return await this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ email });
  }

  async findByToken(token: string): Promise<User> {
    return await this.userRepository.findOne({ token });
  }
}
