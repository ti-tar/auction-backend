import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { LoggerService } from '../shared/logger.service';
import MockedLoggerService from '../../test/services/mockedLogger.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from '../entities/order';

describe('OrdersService', () => {
  let testingModule: TestingModule;
  let service: OrdersService;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(Order),
          useFactory: jest.fn(() => ({
            crete: jest.fn(() => ''),
          }),
          ),
        },
        {
          provide: LoggerService,
          useClass: MockedLoggerService(),
        },
        OrdersService,
      ],
    }).compile();

    service = testingModule.get<OrdersService>(OrdersService);
  });

  afterAll(async () => {
    await testingModule.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
