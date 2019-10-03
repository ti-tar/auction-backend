import { ConfigService } from '../../src/shared/config.service';

export default (mockedJWTToken) => {
  return class MockedConfigService extends ConfigService {
    generateJWT = () => mockedJWTToken;
  };
};
