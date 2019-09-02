import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from '../entities/user';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

declare type MockType<T> = {
  [P in keyof T]: jest.Mock<{}>;
};

const mockedUsers = [
  {
    id: 1,
    title: 'Lot 1'
  },
  {
    id: 2,
    title: 'Lot 2'
  },
  {
    id: 3,
    title: 'Lot 3'
  },
  {
    id: 4,
    title: 'Lot 4'
  },
];

describe('UsersService', () => {
  let service: UsersService;
  let repositoryMock: MockType<Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useFactory: jest.fn(() => ({
            find: jest.fn(() => mockedUsers),
            findOne: jest.fn(id => {
              return mockedUsers.find(user => user.id === parseInt(id, 10));
            }),
          }))
        }
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repositoryMock = module.get(getRepositoryToken(User));
  });

  it.todo('findAll');

  it.todo('findOne');

  it('findOneById', async () => {
    const mockedUser = mockedUsers[0];

    repositoryMock.findOne.mockReturnValue(mockedUser);
-
    expect(await service.findOneById(1)).toEqual(mockedUser);
    expect(repositoryMock.findOne).toHaveBeenCalledWith({"id": mockedUser.id});
  });

  it.todo('create');

  it.todo('delete');

  it.todo('update');
});
