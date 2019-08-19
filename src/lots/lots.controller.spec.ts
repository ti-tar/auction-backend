import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LotsController } from './lots.controller';
import { LotsService } from './lots.service';
import { Lot } from '../entities/lot';
import { async } from 'rxjs/internal/scheduler/async';

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};

describe('Lots Controller', () => {
  let lotsController: LotsController;
  let lotsService: LotsService;
  let repositoryMock: MockType<Repository<Lot>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LotsController],
      providers: [LotsService],
    }).compile();

    lotsService = module.get<LotsService>(LotsService);
    lotsController = module.get<LotsController>(LotsController);
    repositoryMock = module.get(getRepositoryToken(Lot));
  });


    it('LotsService works right', async () => {

      const lot = {
        id: 1,
        title: 'lot 1',
        image: 'lot_1.jpg',
        description: 'description lot 1',
        status: 'pending',
        current_price: 100,
        estimated_price: 1000,
        start_time: new Date,
        end_time: new Date
      };

      jest.spyOn(lotsService, 'findAll').mockImplementation(() => repositoryMock);

      expect(await lotsService.findAll()).toEqual([repositoryMock);
    
    });

});
