import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { getRepository } from 'typeorm';
import { User } from '../entities/user';
import { async } from 'rxjs/internal/scheduler/async';

// mocked login

const mockedAuthLoginRequest = {
  email: 'user1@gmail.com',
  password: 'password',
};

const mockedAuthServiceLoginResponse = {
  id: 1,
  firstName: 'user',
  email: 'user1@gmail.com',
  token: 'jwt_token',
};

const mockedAuthControllerLoginResponse = {
  meta: {},
  resource: mockedAuthServiceLoginResponse,
};

// mocked signin

const mockedAuthSigninRequest = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
};

const mockedAuthServiceSingInResponse = {
  id: 1,
  firstName: 'user',
  email: 'user1@gmail.com',
  token: 'jwt_token',
};

const mockedAuthControllerSingInResponse = {
  meta: {},
  resource: mockedAuthServiceSingInResponse,
};

// tests
describe('Auth Controller', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        AuthController,
      ],
      providers: [
        {
          provide: AuthService,
          useFactory: () => ({
            login: () => mockedAuthServiceLoginResponse,
            create: () => mockedAuthServiceSingInResponse,
            generateJWT: () => 'jwt_token',
          }),
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('auth login', async () => {
    expect(await authController.login(mockedAuthLoginRequest)).toStrictEqual(mockedAuthControllerLoginResponse);
  });

  it('auth signin', async () => {
    expect(await authController.singin(mockedAuthSigninRequest)).toStrictEqual(mockedAuthControllerSingInResponse);
  });

});
