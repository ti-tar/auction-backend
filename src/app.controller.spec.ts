import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let testingModule: TestingModule;
  let controller: AppController;
  let spyService: AppService;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useFactory: () => ({
            getHello: jest.fn(() => 'May, the 4th b with u'),
          }),
        },
      ],
    }).compile();
    controller = testingModule.get(AppController);
    spyService = testingModule.get(AppService);
  });

  describe('getHello()', () => {

    it('Is getHello been called', async () => {
      controller.getHello();
      expect(spyService.getHello).toHaveBeenCalled();
    });

    it('Method getHello returns mocked string.', () => {
      expect(controller.getHello()).toBe('May, the 4th b with u');
    });
  });

});
