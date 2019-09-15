import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';

describe('Users Controller', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it.todo('findAll');

  it.todo('findOne');

  it.todo('findOneById');

  it.todo('create');

  it.todo('delete');

  it.todo('update');
});
