import { Test, TestingModule } from '@nestjs/testing';

import { BidsService } from './bids.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrdersService } from '../orders/orders.service';
import { Bid } from '../entities/bid';
import { LotsGateway } from '../lots/lots.gateway';
import { getMockedBidByField, mockedBids } from '../mockedData/bids';
import { Repository } from 'typeorm';
import { getMockedLotByField } from '../mockedData/lots';
import { getMockedUserByField } from '../mockedData/users';
import { EmailService } from '../emails/email.service';

describe('Bids Service', () => {
  let testingModule: TestingModule;
  let bidsService: BidsService;
  let ordersService: OrdersService;
  let bidsRepository: Repository<Bid>;

  let mockedLot;
  let mockedUser;
  let mockedBid;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      imports: [      ],
      providers: [BidsService,
        {
          provide: getRepositoryToken(Bid),
          useFactory: jest.fn(() => ({
            findAndCount: jest.fn(() => [ mockedBids, mockedBids.length]),
            save: jest.fn(() => mockedBid),
          })),
        },
        {
          provide: LotsGateway,
          useFactory: jest.fn(() => ({
            bidsUpdate: jest.fn(() => ({})),
          })),
        },
        {
          provide: OrdersService,
          useFactory: jest.fn(() => ({
            create: jest.fn(() => ''),
          })),
        },
        {
          provide: EmailService,
          useFactory: jest.fn(() => ({
          })),
        },
      ],
    }).compile();

    bidsService = testingModule.get<BidsService>(BidsService);
    bidsRepository = testingModule.get(getRepositoryToken(Bid));
    ordersService = testingModule.get(OrdersService);

    mockedLot = getMockedLotByField({id: 135, status: 'inProcess' });
    mockedUser = getMockedUserByField({id: 1});
    mockedBid = getMockedBidByField({id: 1});
  });

  afterAll( async  () => {
    await testingModule.close();
  });

  afterEach(() => {
    mockedLot = null;
    mockedUser = null;
    mockedBid = null;
  });

  it('findAllBidsByLotId', async () => {
    expect(await bidsService.findAllBidsByLotId(1)).toStrictEqual([ mockedBids, mockedBids.length]);
    expect(bidsRepository.findAndCount).toHaveBeenCalledWith({relations: ['user'], where: {lot: {id: 1}}});
  });

  it('addBid. Wrong lot status', async () => {
    mockedLot = getMockedLotByField({status: 'pending'});
    await expect(bidsService.addBid(mockedBid, mockedUser, mockedLot))
      .rejects.toThrowError(`You can bid only lots with status 'inProcess'.`);
  });

  it('addBid. bid your own lot', async () => {
    mockedUser = getMockedUserByField(mockedLot.user.id);
    await expect(bidsService.addBid(mockedBid, mockedUser, mockedLot))
      .rejects.toThrowError('You can\'t bid to your own lots');
  });

  it('addBid. price should be greater than current', async () => {
    mockedBid.proposedPrice = mockedLot.currentPrice;
    await expect(bidsService.addBid(mockedBid, mockedUser, mockedLot))
      .rejects.toThrowError('Bid should be higher current price.');
  });

  it('addBid. Regular mode. Bid is greater estimated price.', async () => {
    mockedBid.proposedPrice = mockedLot.estimatedPrice + 1;
    expect(await bidsService.addBid(mockedBid, mockedUser, mockedLot))
      .toEqual(expect.objectContaining({ proposedPrice: mockedBid.proposedPrice}));
    expect(ordersService.create).toHaveBeenCalled();
  });

});
