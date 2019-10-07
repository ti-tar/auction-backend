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

describe('LotsController', () => {

  let app: INestApplication;
  let server;
  let token: string;

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

    app = module.createNestApplication();
    await app.init();
    server = app.getHttpServer();

    // get jwt token
    await request(server)
      .post('/auth/login/')
      .send({email: 'Octavia_Crooks1@gmail.com', password: '123'})
      .expect(201)
      .expect((response: request.Response) => {
        expect(response.body.resource.email).toBe('Octavia_Crooks1@gmail.com');
        token = response.body.resource.token;
      });

  });

  afterAll(() => {
    app.close();
  });

  it('GET /lots. Get lots with status inProgress.', async () => {

    await request(server)
      .get('/lots')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect((response: request.Response) => {
        expect(response.body.resources.length).toEqual(expect.any(Number));
      });
  });

});
