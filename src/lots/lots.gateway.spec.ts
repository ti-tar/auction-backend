import { Test, TestingModule } from '@nestjs/testing';
import { LotsGateway } from './lots.gateway';
import { LoggerService } from '../shared/logger.service';
import MockedLoggerService from '../../test/services/mockedLogger.service';

describe('LotsGateway', () => {
  let gateway: LotsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: LoggerService,
          useClass: MockedLoggerService(),
        },
        LotsGateway,
      ],
    }).compile();

    gateway = module.get<LotsGateway>(LotsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
