import { Test, TestingModule } from '@nestjs/testing';
import { LotsController } from './lots.controller';
import { LotsService } from './lots.service';
import { LoggerService } from '../shared/logger.service';
import MockedLoggerService from '../../test/services/mockedLogger.service';
import { BidsService } from '../bids/bids.service';
import { OrdersService } from '../orders/orders.service';
import { Bid } from '../entities/bid';
import { Order } from '../entities/order';
import { mockedLotsFromDB, getMockedLotByField } from '../mockedData/lots';
import { ConfigService } from '../shared/config.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { getMockedUserByField } from '../mockedData/users';
import { getMockedBidByField } from '../mockedData/bids';
import { MockConfigService } from '../mockedData/mocked-config.service';
import { ImagesService } from '../images/images.service';

describe('Lots Controller', () => {

  let testingModule: TestingModule;
  let lotsService: LotsService;
  let lotsController: LotsController;
  let bidsService: BidsService;
  let imagesService: ImagesService;

  let mockedBid;
  let mockedUser;
  let mockedLot;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({

      controllers: [LotsController],
      providers: [
        OrdersService,
        {
          provide: BidsService,
          useFactory: () => ({
            findAllBidsByLotId: jest.fn(() => true),
            addBid: jest.fn((bidData, user, lot) => bidData),
          }),
        },
        {
          provide: ConfigService,
          useClass: MockConfigService,
        },
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
            findAndCountLotsInProcess: jest.fn(() => mockedLotsFromDB.filter(l => l.status === 'inProgress')),
            findAndCountLotsByUserId: jest.fn(() => [ mockedLot ]),
            findAndCountLotsByBidUserId: jest.fn(() => [ mockedLot ]),
            find: jest.fn(() => true),
            delete: jest.fn(() => true),
            update: jest.fn(() => mockedLot),
            create: jest.fn(() => mockedLot),
            setLotToAuction: jest.fn(() => mockedLot),
          }),
        },
        {
          provide: ImagesService,
          useFactory: () => ({
            resize: jest.fn(() => true),
          }),
        },
      ],
    }).compile();

    lotsController = testingModule.get(LotsController);
    lotsService = testingModule.get(LotsService);
    bidsService = testingModule.get(BidsService);
    imagesService = testingModule.get(ImagesService);
  });

  afterAll(() => {
    testingModule.close();
  });

  beforeEach(() => {
    mockedBid = getMockedBidByField({id: 1});
    mockedUser = getMockedUserByField({ id: 1 });
    mockedLot = getMockedLotByField({ id: 1 });
  });

  afterEach(() => {
    mockedBid = null;
    mockedUser = null;
    mockedLot = null;
  });

  it('should be defined', () => {
    expect(lotsController).toBeDefined();
  });

  it('getAllLots', async () => {
    expect(await lotsController.getAllLots({query: {page: 1}})).toEqual(expect.arrayContaining([]));
    expect(lotsService.findAndCountLotsInProcess).toHaveBeenCalledWith({page: 1});
  });

  it('getAllLotsByUserId', async () => {
    const lots = await lotsController.getAllLotsByUserId(mockedUser, {query: {page: 1}});
    expect(lots[0].title).toBe(mockedLot.title);
    expect(lotsService.findAndCountLotsByUserId).toHaveBeenCalledWith(1, {page: 1});
  });

  it('getAllLotsByBidUserId', async () => {
    const lots = await lotsController.getAllLotsByBidUserId(mockedUser, {query: {page: 1}});
    expect(lots[0].title).toBe(mockedLot.title);
    expect(lotsService.findAndCountLotsByBidUserId).toHaveBeenCalledWith(1, {page: 1});
  });
  it('getLotById', async () => {
    expect(await lotsController.getLotById(1)).toBe(true);
    expect(lotsService.find).toHaveBeenCalledWith(1);
  });

  it('getBidsByLotId', async () => {
    expect(await lotsController.getBidsByLotId(1)).toBe(true);
    expect(bidsService.findAllBidsByLotId).toHaveBeenCalledWith(1);
  });

  it('delete', async () => {
    expect(await lotsController.delete(1)).toBe(true);
    expect(lotsService.delete).toHaveBeenCalledWith(1);
  });

  it('update', async () => {
    expect(await lotsController.update(1, mockedLot, mockedUser))
      .toStrictEqual(mockedLot);
    expect(lotsService.update).toHaveBeenCalled();
  });

  it('create', async () => {
    expect(await lotsController.create(mockedLot, mockedUser))
      .toStrictEqual(mockedLot);
    expect(lotsService.create).toHaveBeenCalled();
  });

  it('setLot', async () => {
    expect( await lotsController.setLot(1, mockedUser))
      .toStrictEqual(mockedLot);
    expect(lotsService.setLotToAuction).toHaveBeenCalled();
  });

  it('addBid', async () => {
    expect( await lotsController.addBid(1, mockedBid, mockedUser)).toStrictEqual(mockedBid);
    expect(bidsService.addBid).toHaveBeenCalled();
  });

  it('upload', async () => {
    expect(await lotsController.uploadFile(null, mockedUser)).toBe(true);
    expect(imagesService.resize).toHaveBeenCalled();
  });

});
