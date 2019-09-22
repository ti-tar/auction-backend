import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { ConfigService } from '../config/config.service';

import * as nodeMailerMock from 'nodemailer-mock';

import * as nodemailer from 'nodemailer';
import { BadRequestException } from '@nestjs/common';

describe('EmailService', () => {
  let emailService: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ConfigService,
          useFactory: () => ({
            get: jest.fn(() => ({})),
            generateJWT: jest.fn(() => ({})),
            typeOrmConfig: jest.fn(() => ({})),
          }),
        },
        EmailService,
      ],
    }).compile();

    emailService = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(emailService).toBeDefined();
  });

  it('should set configuration options', () => {
    const transport = nodeMailerMock.createTransport({
      someOptionKey: 'someOptionValue',
    });

    expect(transport.mock.options).toEqual({ someOptionKey: 'someOptionValue' });
  });

  // it('should store emails sent with nodemailer, so that they can be asserted against', async () => {
  //
  //   const transport = nodeMailerMock.createTransport({
  //     key: 'value',
  //   });
  //
  //   const email = {
  //     from: 'sender@address',
  //     to: 'receiver@address',
  //     subject: 'hello',
  //     text: 'hello world!',
  //   };
  // });
  //
  // it('should return an error and not send an email if there is no `to` in the mail data object', function () {
  //   const transport = nodeMailerMock.createTransport({
  //     foo: 'bar',
  //   });
  //
  //   const transporter = nodemailer.createTransport(transport);
  //
  //   transporter.sendMail({
  //     from: 'sender@address',
  //     subject: 'hello',
  //     text: 'hello world!',
  //   });
  //
  //   transport.sentMail.length.should.equal(0);
  // });

});
