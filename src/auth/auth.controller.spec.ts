import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EmailService } from '../email/email.service';
import { ConfigService } from '../config/config.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { UsersService } from '../users/users.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { SECRET } from '../config';
import { User } from '../entities/user';
import { BadRequestException } from '@nestjs/common';

// LogIn
describe('Auth Controller. LogIn', () => {
  let authController: AuthController;
  let authService: AuthService;

  // mocked login
  const mockedUserInDB: User[] = [
    {
      id: 1,
      email: 'user1@gmail.com',
      phone: '380991234567',
      password: 'hashed_password1',
      firstName: 'user1',
      lastName: 'lastName',
      status: 'approved',
      token: 'jwt_token',
      lots: null,
      bids: null,
      hashPassword: null,
    }, {
      id: 2,
      email: 'user2@gmail.com',
      phone: '380991234567',
      password: 'hashed_password2',
      firstName: 'user2',
      lastName: 'lastName',
      status: 'pending',
      token: 'jwt_token',
      lots: null,
      bids: null,
      hashPassword: null,
    },
  ];

  const mockedAuthServiceLoginResponse = {
    id: mockedUserInDB[0].id,
    firstName: mockedUserInDB[0].firstName,
    email: mockedUserInDB[0].email,
    token: mockedUserInDB[0].token,
  };

  const mockedAuthControllerLoginResponse = {
    meta: {},
    resource: mockedAuthServiceLoginResponse,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secretOrPrivateKey: SECRET,
        }),
      ],
      controllers: [
        AuthController,
      ],
      providers: [
        {
          provide: UsersService,
          useFactory: () => ({
            findByEmail: (email: string) => {
              return mockedUserInDB.find(user => user.email === email);
            },
          }),
        },
        {
          provide: ConfigService,
          useFactory: () => ({
            generateJWT: () => {
              return mockedUserInDB[0].token;
            },
          }),
        },
        EmailService,
        AuthService,
        JwtStrategy, LocalStrategy,
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('login method returns user',  async () => {
    expect(await authController.login({
      email: mockedUserInDB[0].email,
      password: 'password',
    }))
      .toStrictEqual(mockedAuthControllerLoginResponse);
  });

  it('login method throws BadRequestException if user mail not verified',  async () => {
    await expect(
      authController.login({
        email: mockedUserInDB[1].email,
        password: 'password',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

});

// SignUp
describe('Auth Controller. SignUp', () => {
  let authController: AuthController;
  let authService: AuthService;

  // mocked login

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secretOrPrivateKey: SECRET,
          // signOptions: { expiresIn: '60s' },
        }),
      ],
      controllers: [
        AuthController,
      ],
      providers: [
        {
          provide: AuthService,
          useFactory: () => ({
            login: () => '',
            create: () => '',
            generateJWT: () => 'jwt_token',
          }),
        },
        {
          provide: UsersService,
          useFactory: () => ({
            findAll: () => '',
            findOne: () => '',
            findOneById: () => '',
            setToken: () => '',
            create: () => '',
            delete: () => '',
            findByEmail: () => '',
            findByToken: () => '',
          }),
        },
        ConfigService,
        EmailService,
        AuthService,
        JwtStrategy, LocalStrategy,
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

});

// VerifyEmail
describe('Auth Controller. VerifyEmail', () => {
  let authController: AuthController;
  let authService: AuthService;

  // mocked login
  const mockedUserInDB: User[] = [
    {
      id: 1,
      email: 'user1@gmail.com',
      phone: '380991234567',
      password: 'hashed_password1',
      firstName: 'user1',
      lastName: 'lastName',
      status: 'approved',
      token: 'this_is_token_1',
      lots: null,
      bids: null,
      hashPassword: null,
    }, {
      id: 2,
      email: 'user2@gmail.com',
      phone: '380991234567',
      password: 'hashed_password2',
      firstName: 'user2',
      lastName: 'lastName',
      status: 'pending',
      token: 'this_is_token_2',
      lots: null,
      bids: null,
      hashPassword: null,
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secretOrPrivateKey: SECRET,
        }),
      ],
      controllers: [
        AuthController,
      ],
      providers: [
        {
          provide: UsersService,
          useFactory: () => ({
            findByToken: (token: string) => {
              return mockedUserInDB.find(user => user.token === token);
            },
            update: (user: User, updatedData) => {
              const existedUserIndex = mockedUserInDB.findIndex(mUser => mUser.id === user.id);
              return existedUserIndex > -1 ?
                 { ...mockedUserInDB[existedUserIndex], ...updatedData} : { ...user, ...updatedData};
            },
          }),
        },
        ConfigService,
        EmailService,
        AuthService,
        JwtStrategy, LocalStrategy,
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('verify email with exist token. make status approved',  async () => {
    const mockedBody = {
      token: mockedUserInDB[1].token,
    };
    const verifiedUser = await authController.verifyEmail(mockedBody);
    expect(verifiedUser.email).toBe(mockedUserInDB[1].email);
    expect(verifiedUser.status).toBe('approved');
    expect(verifiedUser.token).toBe(null);
  });

  it('verify email with invalid token',  async () => {
    const mockedBody = {
      token: 'invalid_token',
    };
    await expect(authController.verifyEmail(mockedBody)).rejects.toBeInstanceOf(BadRequestException);
  });
});
