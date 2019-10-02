import * as request from 'supertest';
import * as faker from 'faker';
import { AppModule } from '../../src/app.module';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '../../src/shared/config.service';
import { LoggerService } from '../../src/shared/logger.service';
import { CreateUserDto } from '../../src/auth/dto/create-user.dto';
import { LoginUserDto } from '../../src/auth/dto/login-user.dto';
import { VerifyUserDto } from '../../src/auth/dto/verify-user.dto';
import { EmailService } from '../../src/email/email.service';
import { consoleTestResultHandler } from 'tslint/lib/test';

describe('AuthController', () => {

  let app: INestApplication;
  let server;

  const mockedAuthUser: LoginUserDto = {
    email: 'user1@gmail.com',
    password: '123',
  };

  const mockedSignUpUser: CreateUserDto = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.phoneNumber('###########'),
    password: '123',
  };

  const mockedRandomToken = 'test_random_token';
  const mockedJWTToken = 'test_jwt_token';

  const mockedVerifyEmail: VerifyUserDto = {
    token: mockedRandomToken,
  };

  class ConfigTestService extends ConfigService {
    generateJWT = () => mockedJWTToken;
  }

  ConfigService.generateRandomToken = () => mockedVerifyEmail.token;

  // tslint:disable-next-line:max-classes-per-file
  class LoggerTestService extends LoggerService {
    log(message: string): void { return; }
    error(errorOrMessage: any): void { return; }
  }

  beforeAll(async () => {
    // @ts-ignore
    const module = await Test.createTestingModule({
      imports: [
        AppModule,
      ],
    })
      .overrideProvider(ConfigService).useClass(ConfigTestService)
      .overrideProvider(LoggerService).useClass(LoggerTestService)
      .compile();

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
      .expect(201, { resource:
          { id: 1,
            firstName: 'user1',
            email: 'user1@gmail.com',
            token: mockedJWTToken,
          },
        meta: {} });
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

  it('POST /auth/login, Invalid password', async () => {
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
      .send({ token: mockedVerifyEmail.token })
      .expect(201)
      .expect((response: request.Response) => {
        expect(response.body.resource)
          .toMatchObject({
            email: mockedSignUpUser.email,
            token: mockedJWTToken,
          });
        expect(typeof response.body.resource.id).toBe('number');
      });

    // now user are verified. check login
    await request(server)
      .post('/auth/login/')
      .send({email: mockedSignUpUser.email, password: mockedSignUpUser.password})
      .expect(201);
  });

  // it('POST /auth/forgot_password', async () => {
  //   await request(server)
  //     .post('/auth/forgot_password')
  //     .send({ email: mockedSignUpUser.email })
  //     .expect(400)
  //     .expect((response: request.Response) => {
  //       console.log(response.body)
  //       expect(response.body.message).toBe('Letter sent. Check your mailbox');
  //     });
  // });

  // it('POST /auth/reset_password' );

  it.todo('GET  /auth/profile');
});
