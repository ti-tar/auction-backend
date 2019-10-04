import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import * as faker from 'faker';
import { AppModule } from '../../src/app.module';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '../../src/shared/config.service';
import { LoggerService } from '../../src/shared/logger.service';
import { CreateUserDto } from '../../src/auth/dto/create-user.dto';
import { LoginUserDto } from '../../src/auth/dto/login-user.dto';
import { EmailService } from '../../src/email/email.service';
import { UsersService } from '../../src/users/users.service';
import MockedEmailService from '../services/mockedEmail.service';
import MockedLoggerService from '../services/mockedLogger.service';

describe('AuthController', () => {

  let app: INestApplication;
  let server;
  let mockedAuthUser: LoginUserDto;

  const mockedSignUpUser: CreateUserDto = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.phoneNumber('###########'),
    password: '123',
  };

  const mockedRandomToken = `test_random_token_${mockedSignUpUser.firstName}`;
  const newResetPassword = 'new_password';

  ConfigService.generateRandomToken = () => mockedRandomToken;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(EmailService).useClass(MockedEmailService())
      .overrideProvider(LoggerService).useClass(MockedLoggerService())
      .compile();

    const approvedUser = await module.get(UsersService).findOne({ where: {status: 'approved'}, take: 1 });
    if (!approvedUser) {
      throw new Error('No approved users in db');
    }

    mockedAuthUser = {
      email: approvedUser.email,
      password: '123',
    };

    app = module.createNestApplication();
    await app.init();
    server = app.getHttpServer();
  });

  afterAll(() => {
    app.close();
  });

  it('POST /auth/login. Right credentials.', async () => {
    await request(server)
      .post('/auth/login/')
      .send(mockedAuthUser)
      .expect(201)
      .expect((response: request.Response) => {
        expect(response.body.resource.email).toBe(mockedAuthUser.email);
      });
  });

  it('POST /auth/login. Such email does not exist', async () => {
    await request(server)
      .post('/auth/login/')
      .send({...mockedAuthUser, email: 'not_exists_user@gmail.com'})
      .expect(401)
      .expect((response: request.Response) => {
        if (!response.body.error || response.body.error !== 'Unauthorized') {
          throw new Error('Expected "Unauthorized" error');
        }
      });
  });

  it('POST /auth/login. Invalid password', async () => {
    await request(server)
      .post('/auth/login/')
      .send({...mockedAuthUser, password: 'invalid password'})
      .expect(401)
      .expect((response: request.Response) => {
        if (!response.body.error || response.body.error !== 'Unauthorized') {
          throw new Error('Expected "Unauthorized" error');
        }
      });
  });

  it('POST /auth/signup. Success registration. ',  async () => {
    await request(server)
      .post('/auth/signup')
      .send(mockedSignUpUser)
      .expect(201)
      .expect((response: request.Response) => {
        if (!response.body.resource.firstName || response.body.resource.firstName !== mockedSignUpUser.firstName) {
          throw new Error('Wrong "firstName" field.');
        }
        if (!response.body.resource.email || response.body.resource.email !== mockedSignUpUser.email) {
          throw new Error('Wrong "email" field.');
        }
      });
  });

  it('POST /auth/verify/email. Invalid token. ', async () => {
    await request(server)
      .post('/auth/verify/email')
      .send({ token: 'invalid token' })
      .expect(400);
  });

  it('POST /auth/verify/email. Success verification. ', async () => {
    // trying login unverified
    await request(server)
      .post('/auth/login/')
      .send({email: mockedSignUpUser.email, password: mockedSignUpUser.password})
      .expect(400);

    // verify email
    await request(server)
      .post('/auth/verify/email')
      .send({ token: mockedRandomToken })
      .expect(201)
      .expect((response: request.Response) => {
        expect(response.body.resource).toMatchObject({ email: mockedSignUpUser.email });
        expect(typeof response.body.resource.id).toBe('number');
      });

    // now user are verified. check login
    await request(server)
      .post('/auth/login/')
      .send({email: mockedSignUpUser.email, password: mockedSignUpUser.password})
      .expect(201);
  });

  it('POST /auth/forgot_password', async () => {
    await request(server)
      .post('/auth/forgot_password')
      .send({ email: mockedSignUpUser.email })
      .expect(201)
      .expect((response: request.Response) => {
        expect(response.body.message).toBe('Letter sent. Check your mailbox');
      });
  });

  it('POST /auth/reset_password. Check if password reset, login with old and new passwords', async () => {
    await request(server)
      .post('/auth/reset_password')
      .send({ password: newResetPassword, passwordConfirm: newResetPassword, token: mockedRandomToken })
      .expect(201)
      .expect((response: request.Response) => {
        expect(response.body.message).toBe('Password was reset successfully');
      });

    await request(server)
      .post('/auth/login/')
      .send({email: mockedSignUpUser.email, password: mockedSignUpUser.password})
      .expect(401);

    await request(server)
      .post('/auth/login/')
      .send({email: mockedSignUpUser.email, password: newResetPassword})
      .expect(201);
  });

  it('GET  /auth/profile. Login, get token, get own profile info', async () => {
    let token = '';
    await request(server)
      .post('/auth/login/')
      .send({email: mockedSignUpUser.email, password: newResetPassword})
      .expect(201)
      .expect((response: request.Response) => {
        expect(response.body.resource.email).toBe(mockedSignUpUser.email);
        token = response.body.resource.token;
      });

    await request(server)
      .get('/auth/profile')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect((response: request.Response) => {
        expect(response.body.email).toBe(mockedSignUpUser.email);
        expect(response.body.phone).toBe(mockedSignUpUser.phone);
        expect(response.body.firstName).toBe(mockedSignUpUser.firstName);
        expect(response.body.status).toBe('approved');
      });
  });
});
