import { Test, TestingModule } from '@nestjs/testing';
import { getRepository } from 'typeorm';
// services
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        // JwtService,
        // UsersService,
        // {
        //   provide: getRepositoryToken(User),
        //   useFactory: jest.fn(() => ({
        //     findByEmail: jest.fn(() => 'email'),
        //     create: jest.fn(() => 'create'),
        //   })),
        // },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it.todo('should be defined');

  it.todo('login');

  it.todo('singnin');
});
