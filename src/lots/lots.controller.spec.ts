import { Test, TestingModule } from '@nestjs/testing';
import { LotsController } from './lots.controller';
import { LotsService } from './lots.service';
import { LoggerService } from '../shared/logger.service';
import MockedLoggerService from '../../test/services/mockedLogger.service';
import { BidsService } from '../bids/bids.service';
import { LotsGateway } from './lots.gateway';
import { OrdersService } from '../orders/orders.service';
import { Bid } from '../entities/bid';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from '../entities/order';
import { mockedLotsFromDB, getMockedLotByField } from '../mockedData/lots';
import { getMockedUserByField } from '../mockedData/users';

describe('Lots Controller', () => {

  let testingModule: TestingModule;
  let lotsService: LotsService;
  let lotsController: LotsController;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      controllers: [LotsController],
      providers: [
        BidsService,
        LotsGateway,
        OrdersService,
        {
          provide: getRepositoryToken(Bid),
          useFactory: () => ({}),
        },
        {
          provide: getRepositoryToken(Order),
          useFactory: () => ({}),
        },
        {
          provide: LoggerService,
          useClass: MockedLoggerService(),
        },
        {
          provide: LotsService,
          useFactory: () => ({
            findLotsInProcess: jest.fn(() => mockedLotsFromDB.filter(l => l.status === 'inProgress')),
            findLotsByBidUserId: jest.fn(() => [ getMockedLotByField({id: 1}) ]),
            findAllByUserId: jest.fn(() => [ getMockedLotByField({id: 1}) ]),
            find: jest.fn(() => true),
            create: jest.fn(() => true),
          }),
        },
      ],
    }).compile();
    lotsController = testingModule.get(LotsController);
    lotsService = testingModule.get(LotsService);
  });

  it('findLotsInProcess. find all Lots with status InProcess', async () => {
    expect(await lotsController.findLotsInProcess()).toEqual(expect.arrayContaining([]));
    expect(lotsService.findLotsInProcess).toHaveBeenCalled();
  });

  it('findLotsWithOwnBids.', async () => {
    const lots = await lotsController.findLotsWithOwnBids(getMockedUserByField('id', 1));
    expect(lots[0].title).toBe(getMockedLotByField({id: 1}).title);
    expect(lotsService.findLotsByBidUserId).toHaveBeenCalled();
  });

  it.todo('findOwnLots.');
  it.todo('find.');
  it.todo('findBidsById.');
  it.todo('delete.');
  it.todo('update.');
  it.todo('create.');
  it.todo('addBid.');
  it.todo('upload.');

});
