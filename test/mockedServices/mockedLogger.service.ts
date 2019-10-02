import { LoggerService } from '../../src/shared/logger.service';

export default () => {
  return class MockedLoggerService extends LoggerService {
    log(message: string): void { return; }
    error(errorOrMessage: any): void { return; }
  };
};
