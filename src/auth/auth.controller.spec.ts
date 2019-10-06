import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EmailService } from '../email/email.service';
import { ConfigService } from '../shared/config.service';
import { UsersService } from '../users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { SECRET } from '../config';
import { LoggerService } from '../shared/logger.service';
import MockedLoggerService from '../../test/services/mockedLogger.service';
import { getMockedUserByField } from '../mockedData/users';
import singingUpUser from '../mockedData/signup-user-request';

describe('Auth Controller', () => {
  let module: TestingModule;
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        JwtModule.register({ secretOrPrivateKey: SECRET }),
      ],
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useFactory: () => ({
            loginUser: jest.fn((loginDto) => getMockedUserByField('email', loginDto.email)),
            singUp: jest.fn((createUser) => createUser),
            verifyEmail: jest.fn((token) => getMockedUserByField('token', token)),
            forgotPassword: jest.fn(() => ''),
            resetPassword: jest.fn(() => ''),
          }),
        },
        {
          provide: LoggerService,
          useClass: MockedLoggerService(),
        },
        {
          provide: UsersService,
          useFactory: () => ({
            findOneById: jest.fn((id) => getMockedUserByField('id', id)),
          }),
        },
        ConfigService, EmailService,
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterAll(() => {
    module.close();
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('login. method returns user', async () => {
    const user = getMockedUserByField('id', 1);
    expect(await authController.login({
      email: user.email,
      password: '',
    }))
      .toEqual(expect.objectContaining({
        jwtToken: expect.any(String),
        user,
      }));

  });

  it('singUp', async () => {
    const { email, phone, password, firstName, lastName } = singingUpUser;
    expect(await authController.singUp({ email, phone, password, firstName, lastName }))
      .toMatchObject({  email, firstName });
  });

  it('verifyEmail', async () => {
    const user = getMockedUserByField('id', 1);
    expect(await authController.verifyEmail({token: user.token }))
      .toEqual(expect.objectContaining({
        jwtToken: expect.any(String),
        user,
      }));
  });

  it('forgotPassword', async () => {
    expect(await authController.forgotPassword({ email: 'email' }))
      .toStrictEqual({ message: 'Letter sent. Check your mailbox' });
  });

  it('resetPassword', async () => {
    expect(await authController.resetPassword({
      password: '',
      passwordConfirm: '',
      token: '',
    }))
      .toStrictEqual({ message: 'Password was reset successfully' });
  });

  it('profile', async () => {
    const user = getMockedUserByField('id', 1);
    expect(await authController.profile(user))
      .toStrictEqual(user);
  });

});
