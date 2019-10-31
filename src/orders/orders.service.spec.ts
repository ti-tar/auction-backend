import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { LoggerService } from '../shared/logger.service';
import MockedLoggerService from '../../test/services/mockedLogger.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from '../entities/order';
import { LotsService } from '../lots/lots.service';
import { mockedLotsFromDB } from '../mockedData/lots';
import { LotStatus } from '../entities/lot';

describe('OrdersService', () => {
  let testingModule: TestingModule;
  let service: OrdersService;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
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
        {
          provide: LotsService,
          useFactory: () => ({
            findAndCountLotsInProcess: jest.fn(() => mockedLotsFromDB.filter(l => l.status === LotStatus.inProcess)),
            findAndCountLotsByUserId: jest.fn(() => ('')),
            findAndCountLotsByBidUserId: jest.fn(() => ('')),
            findOne: jest.fn(() => true),
            delete: jest.fn(() => true),
            update: jest.fn(() => ('')),
            create: jest.fn(() => ('')),
            setLotToAuction: jest.fn(() => ('')),
          }),
        },

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
