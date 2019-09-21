import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { ConfigService } from '../config/config.service';

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
});
