import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LotsService } from './lots.service';
import { Lot } from '../entities/lot';
import { Pagination } from '../shared/pagination';
import { LotJobsService } from './lot-jobs.service';
import { LoggerService } from '../shared/logger.service';
import { ConfigService } from '../shared/config.service';
import MockedLoggerService from '../../test/services/mockedLogger.service';
import { BidsService } from '../bids/bids.service';
import { MockConfigService } from '../mockedData/mocked-config.service';
import { getMockedLotByField } from '../mockedData/lots';
import { getMockedUserByField } from '../mockedData/users';

describe('Lots Service', () => {
  let testingModule: TestingModule;
  let lotsService: LotsService;
  let lotsRepository: Repository<Lot>;

  let mockedLot;
  let mockedUser;

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        LotsService,
        { provide: LotJobsService,
          useFactory: () => ({
            addJob: jest.fn( () => ''),
          }),
        },
        {
          provide: LoggerService,
          useClass: MockedLoggerService(),
        },
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
          provide: getRepositoryToken(Lot),
          useFactory: jest.fn(() => ({
            findOne: jest.fn(id => getMockedLotByField({id})),
            delete: jest.fn(id => mockedLot),
            save: jest.fn( entity => entity),
            findAndCount: jest.fn( () => [[mockedLot], 1]),
            createQueryBuilder: jest.fn(() => ({
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              take: jest.fn().mockReturnThis(),
              skip: jest.fn().mockReturnThis(),
              getManyAndCount: () => [[mockedLot], 1],
            })),
          })),
        },
      ],
    }).compile();

    lotsService = testingModule.get<LotsService>(LotsService);
    lotsRepository = testingModule.get(getRepositoryToken(Lot));
  });

  afterAll( async () => {
    await testingModule.close();
  });

  beforeEach(() => {
    mockedLot = getMockedLotByField({ id: 1 });
    mockedUser = getMockedUserByField({id: 1});
  });

  afterEach(() => {
    mockedLot = null;
    mockedUser = null;
  });

  it('findAndCountLotsInProcess', async () => {
    const res = await lotsService.findAndCountLotsInProcess({page: 1});
    expect(res).toBeInstanceOf(Pagination);
    expect(res).toStrictEqual(new Pagination({data: [mockedLot], total: 1}));
  });

  it('findAndCountLotsByUserId', async () => {
    const res = await lotsService.findAndCountLotsByUserId(1, {page: 1});
    expect(res).toBeInstanceOf(Pagination);
    expect(res).toStrictEqual(new Pagination({data: [mockedLot], total: 1}));
  });

  it('findAndCountLotsByBidUserId', async () => {
    const res = await lotsService.findAndCountLotsByBidUserId(1, {page: 1});
    expect(res).toBeInstanceOf(Pagination);
    expect(res).toStrictEqual(new Pagination({data: [mockedLot], total: 1}));
  });

  it('findOne', async () => {
    const lot = await lotsService.findOne(mockedLot.id);
    expect(lotsRepository.findOne).toHaveBeenCalled();
    expect(lot).toStrictEqual(mockedLot);
  });

  it('delete. Wrong lot status', async () => {
    mockedLot = getMockedLotByField({status: 'inProcess'});
    await expect(lotsService.delete(mockedLot.id))
      .rejects.toThrowError('Only lot with status \'pending\' might be updated or deleted.');
  });

  it('delete', async () => {
    mockedLot = getMockedLotByField({status: 'pending'});
    expect(await lotsService.delete(mockedLot.id)).toStrictEqual(mockedLot);
  });

  it('setLotToAuction. Not owner.', async () => {
    mockedLot = getMockedLotByField({status: 'pending'});
    mockedUser = getMockedUserByField({ id: 2});
    await expect(lotsService.setLotToAuction(mockedLot.id, mockedUser))
      .rejects.toThrowError('You can update only your own lots.');
  });

  it('setLotToAuction. Endtime passed error.', async () => {
    mockedLot = getMockedLotByField({id: 27, status: 'pending'});

    await expect(lotsService.setLotToAuction(mockedLot.id, mockedUser))
      .rejects.toThrowError('Lot endtime should be grater than current time.');
  });

  it('setLotToAuction.', async () => {
    mockedLot = getMockedLotByField({status: 'pending'});
    expect(await lotsService.setLotToAuction(mockedLot.id, mockedUser))
      .toStrictEqual(expect.objectContaining({id: mockedLot.id, status: 'inProcess'}));
  });

  it('update', async () => {
    expect(await lotsService.update(1, {...mockedLot, title: 'updated_title'}, mockedUser))
      .toStrictEqual(expect.objectContaining({title: 'updated_title'}));
  });

  it('update. Updating not owners lot.', async () => {
    mockedUser = getMockedUserByField({ id: 2});
    await expect(lotsService.update(1, {...mockedLot, title: 'updated_title'}, mockedUser))
      .rejects.toThrowError('You can update only your own lots.');
  });

  it('update. Wrong lot status', async () => {
    mockedLot = getMockedLotByField({status: 'inProcess'});
    await expect(lotsService.update(mockedLot.id, mockedLot, mockedUser))
      .rejects.toThrowError('Only lot with status \'pending\' might be updated or deleted.');
  });

  it('create', async () => {
    expect(await lotsService.create( mockedLot, mockedUser))
      .toStrictEqual(expect.objectContaining({title: mockedLot.title }));
  });
});
