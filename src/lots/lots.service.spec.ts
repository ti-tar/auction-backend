import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LotsService } from './lots.service';
import { Lot } from '../entities/lot';

type MockType<T> = {
  [P in keyof T]: jest.Mock<{}>;
};

const mockedLots = [
  {
    id: 1,
    title: 'Lot 1',
  },
  {
    id: 2,
    title: 'Lot 2',
  },
  {
    id: 3,
    title: 'Lot 3',
  },
  {
    id: 4,
    title: 'Lot 4',
  },
];

const mockedLot = {
  id: 123,
  title: 'Lot 123',
};

const repositoryMockFactory = jest.fn(() => ({
  find: jest.fn(() => mockedLots),
  findOne: jest.fn(id => mockedLot),
}));

describe('Lots Service', () => {
  let lotService: LotsService;
  let repositoryMock: MockType<Repository<Lot>>;

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LotsService,
        {
          provide: getRepositoryToken(Lot),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    lotService = module.get<LotsService>(LotsService);
    repositoryMock = module.get(getRepositoryToken(Lot));
  });

  it('fetch all lots', async () => {
    repositoryMock.find.mockReturnValue(mockedLots);
    expect(await lotService.findAll()).toEqual(mockedLots);
  });

  it('fetch a lot by id', async () => {
    repositoryMock.findOne.mockReturnValue(mockedLot);

    expect(await lotService.find(mockedLot.id)).toEqual(mockedLot);
    expect(repositoryMock.findOne).toBeCalled();
  });
});
