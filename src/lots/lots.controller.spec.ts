import { Test, TestingModule } from '@nestjs/testing';
import { LotsController } from './lots.controller';
import { LotsService } from './lots.service';
import { Lot } from '../entities/lot';

describe('Lots Controller', () => {

  let testingModule;
  let lotsService;
  let lotsController;

  const mockedFindAllResponse = [1,2,3];

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      controllers: [LotsController],
      providers: [
        {
          provide: LotsService,
          useFactory: () => ({
            findAll: jest.fn(() => mockedFindAllResponse),
            find: jest.fn(() => true),
            create: jest.fn(() => true),
          }),
        },
      ],
    }).compile();
    lotsController = testingModule.get(LotsController);
    lotsService = testingModule.get(LotsService);
  });

  describe('findAll()', () => {
    it('findAll() called', () => {
      lotsController.findAll();
      expect(lotsService.findAll).toHaveBeenCalled();
      
    });
    it('findAll() resturns proper response', () => {
      expect(lotsService.findAll()).toBe(mockedFindAllResponse);
    });
  });

    // it('lot by id', () => {
    //   const lots = [];
    //   expect(typeof lots).toBe('object');
    // });
  
    // it('lot by wrong id', () => {
    //   const lots = [];
    //   expect(typeof lots).toBe('object');
    // });
  
});
