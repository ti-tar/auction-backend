import { Test, TestingModule } from '@nestjs/testing';
import { LotsController } from './lots.controller';
import { LotsService } from './lots.service';
import { Lot } from '../entities/lot';
import { async } from 'rxjs/internal/scheduler/async';

describe('Lots Controller', () => {

  let testingModule: TestingModule;
  let lotsService: LotsService;
  let lotsController: LotsController;

  const mockedServiceFindAllResponse = [1, 2, 3];
  const expectedControlelrFindAllResponse = {
    meta: {},
    resources: [1, 2, 3],
  };

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      controllers: [LotsController],
      providers: [
        LotsService,
        /*{
          provide: LotsService,
          useFactory: () => ({
            findAll: jest.fn(() => mockedServiceFindAllResponse),
            find: jest.fn(() => true),
            create: jest.fn(() => true),
          }),
        },*/
      ],
    }).compile();
    lotsController = testingModule.get(LotsController);
    lotsService = testingModule.get(LotsService);
  });

  describe('findAll()', () => {

    // jest.spyOn(lotsService, 'findAll').mockImplementation(() => mockedServiceFindAllResponse);

    // expect(await LotsController.findAll()).toBe(result);

    it.todo('findAll() called');

    /*
    it('findAll() called', () => {
      lotsController.findAll();
      expect(lotsService.findAll).toHaveBeenCalled();
    });
    */

    it.todo('findAll() resturns proper response');

    /*
    it('findAll() resturns proper response', async () => {
      expect(await lotsController.findAll()).toStrictEqual(expectedControlelrFindAllResponse);
    });
    */

  });
});
