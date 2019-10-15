import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { getMockedUserByField } from '../mockedData/users';
import { hasCommentAfterPosition } from 'tslint';

describe('Users Controller', () => {
  let testingModule: TestingModule;
  let userController: UsersController;
  let userService: UsersService;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useFactory: jest.fn(() => ({
            findOneById: jest.fn(id => getMockedUserByField(id)),
          })),
        },
      ],
    }).compile();

    userController = testingModule.get<UsersController>(UsersController);
    userService = testingModule.get<UsersService>(UsersService);
  });

  afterAll( async () => {
    await testingModule.close();
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  it('getUser', async () => {
    expect(await userController.getUser(1)).toStrictEqual(getMockedUserByField(1));
    expect(userService.findOneById).toHaveBeenCalledWith(1);
  });
});
