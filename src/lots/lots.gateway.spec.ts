import { Test, TestingModule } from '@nestjs/testing';
import { LotsGateway } from './lots.gateway';

describe('LotsGateway', () => {
  let gateway: LotsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LotsGateway],
    }).compile();

    gateway = module.get<LotsGateway>(LotsGateway);
  });

  // it('should be defined', () => {
  //   expect(gateway).toBeDefined();
  // });
});
