import * as request from 'supertest';
import * as faker from 'faker';
import { AppModule } from '../../src/app.module';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '../../src/shared/config.service';
import { LoggerService } from '../../src/shared/logger.service';
import { CreateUserDto } from '../../src/auth/dto/create-user.dto';
import { LoginUserDto } from '../../src/auth/dto/login-user.dto';

describe('AuthController', () => {

  let app: INestApplication;

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

  class ConfigTestService extends ConfigService {
    generateJWT = () => 'test_jwt_token';
  }

  class LoggerTestService extends LoggerService {
    log(message: string): void { return; }
    error(errorOrMessage: any): void { return; }
  }

  beforeAll(async () => {
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
  });

  afterAll(() => {
    app.close();
  });

  it('POST /auth/login. Right credentials.', () => {

    return request(app.getHttpServer())
      .post('/auth/login/')
      .send(mockedAuthUser)
      .expect(201, { resource:
          { id: 1,
            firstName: 'user1',
            email: 'user1@gmail.com',
            token: 'test_jwt_token',
          },
        meta: {} });
  });

  it('POST /auth/login. Such email does not exist', () => {
    return request(app.getHttpServer())
      .post('/auth/login/')
      .send({...mockedAuthUser, email: 'not_exists_user@gmail.com'})
      .expect(401)
      .expect((response: request.Response) => {
        if (!response.body.error || response.body.error !== 'Unauthorized') {
          throw new Error('Expected "Unauthorized" error');
        }
      });
  });

  it('POST /auth/login, Invalid password', () => {
    return request(app.getHttpServer())
      .post('/auth/login/')
      .send({...mockedAuthUser, password: 'invalid password'})
      .expect(401)
      .expect((response: request.Response) => {
        if (!response.body.error || response.body.error !== 'Unauthorized') {
          throw new Error('Expected "Unauthorized" error');
        }
      });
  });

  it('POST /auth/signup. Success registration. ', () => {
    return request(app.getHttpServer())
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

  it.todo('POST /auth/verify/email');
  it.todo('POST /auth/forgot_password');
  it.todo('POST /auth/reset_password');
  it.todo('GET  /auth/profile');
});
