import { Test, TestingModule } from '@nestjs/testing';
import * as fs from 'fs';
import { ImagesService } from './images.service';
import { LoggerService } from '../shared/logger.service';
import MockedLoggerService from '../../test/services/mockedLogger.service';
import { inputFile } from '../mockedData/images/fixtures';
import { ConfigService } from '../shared/config.service';
import { getMockedUserByField } from '../mockedData/users';

describe('ImagesService', () => {
  let module: TestingModule;
  let imageService: ImagesService;
  let mockedUser;
  let configService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        ImagesService,
        {
          provide: ConfigService,
          useFactory: () => ({
            getLotCoverPath: jest.fn((filename) => `tmp/${filename}`),
            lotCoverThumbWidth: 200,
          }),
        },
        {
          provide: LoggerService,
          useClass: MockedLoggerService(),
        },
      ],
    }).compile();

    imageService = module.get(ImagesService);
    configService = module.get(ConfigService);
  });

  afterAll(async () => {
    if (fs.existsSync(configService.getLotCoverPath(inputFile.filename))) {
      await fs.unlinkSync(configService.getLotCoverPath(inputFile.filename));
    }
    await module.close();
  });

  beforeEach(() => {
    mockedUser = getMockedUserByField({ id: 1 });
  });

  afterEach(() => {
    mockedUser = null;
  });

  it('should be defined', () => {
    expect(imageService).toBeDefined();
  });

  it('resize', async () => {
    expect(await imageService.resize(inputFile, mockedUser)).toEqual(expect.objectContaining({ width: configService.lotCoverThumbWidth }));
    await fs.unlinkSync(configService.getLotCoverPath(inputFile.filename));
  });
});
