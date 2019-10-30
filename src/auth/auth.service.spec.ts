import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { EmailService } from '../emails/email.service';
import { LoggerService } from '../shared/logger.service';
import MockedLoggerService from '../../test/services/mockedLogger.service';
import { ConfigService } from '../shared/config.service';
import { BadRequestException } from '@nestjs/common';
import { mockedUsersFromDB, getMockedUserByField } from '../mockedData/users';
import singingUpUser from '../mockedData/signup-user-request';
import { JwtModule } from '@nestjs/jwt';
import { SharedModule } from '../shared/shared.module';
import { MockConfigService } from '../mockedData/mocked-config.service';

describe('AuthService', () => {
  let module: TestingModule;
  let authService: AuthService;
  let userService: UsersService;
  let emailService: EmailService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        JwtModule.registerAsync({
          useFactory: (configService: ConfigService) => ({
            secret: configService.config.jwt.secretKey,
          }),
          imports: [SharedModule],
          inject: [ConfigService],
        }),
      ],
      providers: [
        AuthService,
        {
          provide: ConfigService,
          useClass: MockConfigService,
        },
        {
          provide: LoggerService,
          useClass: MockedLoggerService(),
        },
        {
          provide: UsersService,
          useFactory: jest.fn(() => ({
            findByEmail: jest.fn((email: string) => mockedUsersFromDB.find(user => user.email === email)),
            findByToken: jest.fn((token: string) => getMockedUserByField({ token })),
            findOne: jest.fn((id: number) => getMockedUserByField({ id })),
            update: jest.fn(user => user),
            save: jest.fn(user => user),
          })),
        },
        {
          provide: EmailService,
          useFactory: jest.fn(() => ({
            sendVerificationEmail: jest.fn(() => ({ envelope: { to: []}})),
            sendApprovalEmail: jest.fn(() => ({ envelope: { to: []}})),
            sendForgotPasswordMail: jest.fn(() => ({ envelope: { to: []}})),
          })),
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UsersService>(UsersService);
    emailService = module.get<EmailService>(EmailService);
  });

  afterAll(() => {
    module.close();
  });

  it('authService should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('loginUser. Success login', async () => {
    const loginUser = getMockedUserByField({ status: 'approved'});
    expect(await authService.loginUser({ email: loginUser.email, password: '' }))
      .toEqual(expect.objectContaining({ email: loginUser.email }));
  });

  it('loginUser. User not exist', async () => {
    await expect(authService.loginUser({ email: 'not_exist@gmail.com', password: '' }))
      .rejects.toThrowError(BadRequestException);
  });

  it('loginUser. User not approved', async () => {
    const loginUser = getMockedUserByField({ status: 'pending'});
    await expect(authService.loginUser({ email: loginUser.email, password: '' }))
      .rejects.toThrowError(BadRequestException);
    expect(userService.findByEmail).toHaveBeenCalledWith(loginUser.email);
  });

  it('singUp. Success sing up.', async () => {
    const user = await authService.singUp(singingUpUser);
    expect(user)
      .toEqual(expect.objectContaining({ email: singingUpUser.email }));
    expect(userService.findByEmail).toHaveBeenCalledWith(singingUpUser.email);
    expect(userService.save).toHaveBeenCalled();
    expect(emailService.sendVerificationEmail).toHaveBeenCalled();
  });

  it('singUp. Email already exist in DB', async () => {
    const registeredUser = mockedUsersFromDB[0];
    await expect(authService.singUp({...singingUpUser, email: registeredUser.email }))
      .rejects.toThrowError(BadRequestException);
  });

  it('verifyEmail. Success email verifying.', async () => {
    const notVerifiedUser = getMockedUserByField({status: 'pending'});
    const verifiedUser = await authService.verifyEmail(notVerifiedUser.token);
    expect(verifiedUser)
      .toEqual(expect.objectContaining({
        email: notVerifiedUser.email,
        status: 'approved',
        token: null,
    }));
    // expect(emailService.sendApprovalEmail).toHaveBeenCalledWith(verifiedUser);
  });

  it('verifyEmail. Invalid token', async () => {
    await expect(authService.verifyEmail('invalid_token'))
      .rejects.toThrowError('Invalid token.');
  });

  it('forgotPassword. Success implementing', async () => {
    const pendingStatusUser = getMockedUserByField({ status: 'approved'});
    expect(await authService.forgotPassword({ email: pendingStatusUser.email }))
      .toEqual(expect.objectContaining({
        email: pendingStatusUser.email,
      }));
    // expect(emailService.sendForgotPasswordMail).toHaveBeenCalled();
  });

  it('forgotPassword. No such email.', async () => {
    await expect(authService.forgotPassword({ email: 'not_existed_email' }))
      .rejects.toThrowError('No such email.');
  });

  it('forgotPassword. Haven\'t been approved user.', async () => {
    const pendingStatusUser = getMockedUserByField({ status: 'pending' });
    await expect(authService.forgotPassword({ email: pendingStatusUser.email }))
      .rejects.toThrowError('You haven\'t been approved.');
  });

  it('resetPassword. Success implementing', async () => {
    const approvedUser = getMockedUserByField({ status: 'approved'});
    expect(await authService.resetPassword({ password: '1', passwordConfirm: '1', token: approvedUser.token }))
      .toEqual(expect.objectContaining({password: ConfigService.getPasswordsHash('1')}));
  });

  it('resetPassword. Passwords should not be equal', async () => {
    await expect(authService.resetPassword({ password: '1', passwordConfirm: '2', token: '' }))
      .rejects.toThrowError('Passwords should not be equal');
  });

  it('resetPassword. Account was not been approved.', async () => {
    const pendingStatusUser = getMockedUserByField({ status: 'pending'});
    await expect(authService.resetPassword({ password: '1', passwordConfirm: '1', token: pendingStatusUser.token }))
      .rejects.toThrowError('Your account was not been approved.');
  });

  it('resetPassword. No user with such token.', async () => {
    await expect(authService.resetPassword({
      password: '1', passwordConfirm: '1', token: 'invalid_token',
    }))
      .rejects.toThrowError('No user with such token.');
  });

  it('validateUser. Success implementing', async () => {
    const user = getMockedUserByField({status: 'approved'});
    expect(await authService.validateUser(user.email, '123')).toStrictEqual(user);
  });

  it('validateUser. Wrong email/password', async () => {
    const user = getMockedUserByField({ status: 'approved' });
    expect(await authService.validateUser(user.email, 'invalid_password')).toBeNull();
  });

});
