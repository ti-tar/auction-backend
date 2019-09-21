import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EmailService } from '../email/email.service';
import { ConfigService } from '../config/config.service';
import { UsersService } from '../users/users.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { SECRET } from '../config';
import { User } from '../entities/user';
import { BadRequestException } from '@nestjs/common';

// mocked db users
const mockedUserInDBData: User[] = [
  {
    id: 1,
    email: 'user1@gmail.com',
    phone: '380991234567',
    password: 'hashed_password1',
    firstName: 'Approved User',
    lastName: 'lastName',
    status: 'approved',
    token: 'token_user_1',
    lots: null,
    bids: null,
    hashPassword: null,
  }, {
    id: 2,
    email: 'user2@gmail.com',
    phone: '380991234567',
    password: 'hashed_password2',
    firstName: 'Pending User',
    lastName: 'lastName',
    status: 'pending',
    token: 'token_user_2',
    lots: null,
    bids: null,
    hashPassword: null,
  },
];

const mockedSignedUpUser: User = {
  id: 42,
  email: '123123123123@gmail.com',
  phone: '380991234567',
  password: 'hashed_password',
  firstName: 'user',
  lastName: 'lastName',
  status: 'pending',
  token: 'token_user_42',
  lots: null,
  bids: null,
  hashPassword: null,
};

// LogIn
describe('Auth Controller. LogIn', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockedUserInDB: User[] = [...mockedUserInDBData];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule, JwtModule.register({ secretOrPrivateKey: SECRET }),
      ],
      controllers: [AuthController],
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
        EmailService, AuthService,
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
      .toStrictEqual({
        meta: {},
        resource: {
          id: mockedUserInDB[0].id,
          firstName: mockedUserInDB[0].firstName,
          email: mockedUserInDB[0].email,
          token: mockedUserInDB[0].token,
        },
      });
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
  let emailService: EmailService;

  const mockedUserInDB: User[] = [...mockedUserInDBData];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule,
        JwtModule.register({ secretOrPrivateKey: SECRET }),
      ],
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useFactory: () => ({
            singUp: jest.fn(
              () => ({ ...mockedSignedUpUser }),
            ),
          }),
        },
        {
          provide: UsersService,
          useFactory: () => ({
            create: () => '',
            findByEmail: (email) => {
              return mockedUserInDB.find(({ email: mockedEmail }) => mockedEmail === email);
            },
          }),
        },
        {
          provide: EmailService,
          useFactory: () => ({
            sendEmail: jest.fn(() => ({})),
          }),
        }, ConfigService,
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    emailService = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('signed user fields must rely incoming fields.', async () => {
    const { id, email, phone, password, firstName, lastName, status } = mockedSignedUpUser;
    expect(await authController.singUp({ email, phone, password, firstName, lastName }))
      .toMatchObject({
        meta: {},
        resource: { id, email, firstName, status },
      });
    });

  it('BadRequestException on exist email', async () => {
    await expect(authController.singUp({
      email: 'user2@gmail.com',
      phone: '380991234567',
      password: 'hashed_password',
      firstName: 'user',
      lastName: 'lastName',
    })).rejects.toBeInstanceOf(BadRequestException);
  });

  it('emailService.sendEmail should be called', async () => {
    await authController.singUp({
      email: 'some_other_email@gmail.com',
      phone: '380991234567',
      password: 'hashed_password',
      firstName: 'user',
      lastName: 'lastName',
    });
    expect(emailService.sendEmail).toBeCalled();
  });
});

// VerifyEmail
describe('Auth Controller. VerifyEmail', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockedUserInDB: User[] = [...mockedUserInDBData];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule, JwtModule.register({ secretOrPrivateKey: SECRET }),
      ],
      controllers: [AuthController],
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
        ConfigService, EmailService, AuthService,
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

// forgotPassword resetPassword
describe('Auth Controller. forgotPassword resetPassword', () => {
  let authController: AuthController;
  let authService: AuthService;
  let emailService: EmailService;

  const mockedUserInDB: User[] = [...mockedUserInDBData];

  beforeEach( async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule,
        JwtModule.register({ secretOrPrivateKey: SECRET }),
      ],
      controllers: [AuthController],
      providers: [{
          provide: UsersService,
          useFactory: () => ({
            findByEmail: jest.fn((email: string) => {
              return mockedUserInDB.find(user => user.email === email);
            }),
            findByToken: jest.fn((token: string) => {
              return mockedUserInDB.find(user => user.token === token);
            }),
            update: jest.fn((user: User, updatedData) => {
              const existedUserIndex = mockedUserInDB.findIndex(mUser => mUser.id === user.id);
              return existedUserIndex > -1 ?
                { ...mockedUserInDB[existedUserIndex], ...updatedData} : { ...user, ...updatedData};
            }),
          }),
        },
        {
          provide: EmailService,
          useFactory: () => ({
            sendEmail: jest.fn(() => ({})),
          }),
        },
        AuthService, ConfigService,
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    emailService = module.get<EmailService>(EmailService);
  });

  // forgotPassword
  it('No such email.', async () => {
    await expect(authController.forgotPassword({ email: 'not_existed_email' }))
      .rejects
      .toThrowError('No such email.');
  });

  it('You haven\'t been approved.', async () => {
    await expect(authController.forgotPassword({ email: mockedUserInDB[1].email }))
      .rejects
      .toThrowError('You haven\'t been approved.');
  });

  it('success, emailService been called', async () => {
    expect(await authController.forgotPassword({ email: mockedUserInDB[0].email }))
      .toStrictEqual({ message: 'Letter sent. Check your mailbox' });
    expect(emailService.sendEmail).toBeCalled();
  });

  // resetPassword
  it('no such user (token)', async () => {
    const { password } = mockedUserInDB[0];

    await expect(authController.resetPassword({
      password, passwordConfirmation: '' , token: '',
    }))
      .rejects
      .toThrowError('Passwords not equal');

    await expect(authController.resetPassword({
      password, passwordConfirmation: password , token: 'invalid_token',
    }))
      .rejects
      .toThrowError('No such user.');
  });

  it('account was not approved', async () => {
    const { password, token } = mockedUserInDB[1];

    await expect(authController.resetPassword({
      password, passwordConfirmation: password, token,
    }))
      .rejects
      .toThrowError('Your account was not approved.');
  });

  it('password reset successfully', async () => {
    const { password, token } = mockedUserInDB[0];
    expect(await authController.resetPassword({
      password, passwordConfirmation: password, token,
    }))
      .toStrictEqual({ message: 'Password were reset successfully' });
  });
});
