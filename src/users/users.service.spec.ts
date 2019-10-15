import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from '../entities/user';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { getMockedLotByField } from '../mockedData/lots';
import { getMockedUserByField, mockedUsersFromDB } from '../mockedData/users';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: Repository<User>;

  let mockedLot;
  let mockedUser;

  let testingModule: TestingModule;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useFactory: jest.fn(() => ({
            find: jest.fn(() => mockedUsersFromDB),
            findOne: jest.fn(options => getMockedUserByField(options)),
            update: jest.fn((id, entity) => entity),
            save: jest.fn(entity => entity),
          })),
        },
      ],
    }).compile();

    usersService = testingModule.get<UsersService>(UsersService);
    usersRepository = testingModule.get(getRepositoryToken(User));

    mockedLot = getMockedLotByField({ id: 1 });
    mockedUser = getMockedUserByField({id: 1 });
  });

  afterEach(() => {
    mockedLot = null;
    mockedUser = null;
  });

  afterAll( async () => {
    await testingModule.close();
  });

  it('findAll', async () => {
    expect(await usersService.findAll()).toHaveLength(mockedUsersFromDB.length);
    expect(usersRepository.find).toHaveBeenCalled();
  });

  it('findOne', async () => {
    expect(await usersService.findOne(1)).toStrictEqual(getMockedUserByField({id: 1}));
    expect(usersRepository.findOne).toHaveBeenCalled();
  });

  it('findOneById', async () => {
    expect(await usersService.findOneById(mockedUser.id)).toStrictEqual(mockedUser);
    expect(usersRepository.findOne).toHaveBeenCalledWith(mockedUser.id);
  });

  it('update', async () => {
    expect(await usersService.update(mockedUser)).toStrictEqual(mockedUser);
    expect(usersRepository.update).toHaveBeenCalledWith(mockedUser.id, mockedUser);
  });

  it('save', async () => {
    expect(await usersService.save(mockedUser)).toStrictEqual(mockedUser);
    expect(usersRepository.save).toHaveBeenCalledWith(mockedUser);
  });

  it('findByEmail', async () => {
    expect(await usersService.findByEmail(mockedUser.email)).toStrictEqual(mockedUser);
    expect(usersRepository.findOne).toHaveBeenCalledWith({ email: mockedUser.email });
  });

  it('findByToken', async () => {
    expect(await usersService.findByToken(mockedUser.token)).toStrictEqual(mockedUser);
    expect(usersRepository.findOne).toHaveBeenCalledWith({ token: mockedUser.token });
  });
});
