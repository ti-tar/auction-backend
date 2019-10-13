import { Module, Global, HttpModule } from '@nestjs/common';
import { ConfigService } from './config.service';
import { JwtModule } from '@nestjs/jwt';
import { SECRET } from '../config';

@Global()
@Module({
    providers: [
      ConfigService,
    ],
    imports: [
      HttpModule,
      JwtModule.register({
        secretOrPrivateKey: SECRET,
        // signOptions: { expiresIn: '60s' },
      }),
    ],
    exports: [
      ConfigService, HttpModule, JwtModule,
    ],
})
export class SharedModule {}
