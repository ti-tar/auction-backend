import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { ConfigService } from '../shared/config.service';
import { LoggerService } from '../shared/logger.service';
import MockedLoggerService from '../../test/services/mockedLogger.service';
import { MockConfigService } from '../mockedData/mocked-config.service';
import * as SMTPTransport from 'nodemailer/lib/smtp-transport';
import { getMockedUserByField } from '../mockedData/users';

describe('EmailService', () => {
  let testingModule: TestingModule;
  let emailService: EmailService;
  let mockedUser;

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ConfigService,
          useClass: MockConfigService,
        },
        {
          provide: LoggerService,
          useClass: MockedLoggerService(),
        },
        EmailService,
      ],
    }).compile();

    emailService = testingModule.get<EmailService>(EmailService);
    mockedUser = getMockedUserByField({ id: 2 });
  });

  afterAll(async () => {
    await testingModule.close();
  });

  it('should be defined', () => {
    expect(emailService).toBeDefined();
  });

  it('sendVerificationEmail', async () => {
    // @ts-ignore
    emailService.sendEmail = (emailObject: SMTPTransport.Options) => emailObject;
    const sentEmailInfo = await emailService.sendVerificationEmail(mockedUser);
    expect(sentEmailInfo).toEqual(expect.objectContaining({ to: mockedUser.email }));
  });

  it('sendApprovalEmail', async () => {
    // @ts-ignore
    emailService.sendEmail = (emailObject: SMTPTransport.Options) => emailObject;
    const sentEmailInfo = await emailService.sendApprovalEmail(mockedUser);
    expect(sentEmailInfo).toEqual(expect.objectContaining({ to: mockedUser.email }));
  });
  it('sendForgotPasswordMail', async () => {
    // @ts-ignore
    emailService.sendEmail = (emailObject: SMTPTransport.Options) => emailObject;
    const sentEmailInfo = await emailService.sendForgotPasswordMail(mockedUser);
    expect(sentEmailInfo).toEqual(expect.objectContaining({ to: mockedUser.email }));
  });

});
