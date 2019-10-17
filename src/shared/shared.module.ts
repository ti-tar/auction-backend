import { Module, Global, HttpModule } from '@nestjs/common';
import { ConfigService } from './config.service';
import { LoggerService } from './logger.service';

@Global()
@Module({
    providers: [ ConfigService, LoggerService ],
    imports: [ HttpModule ],
    exports: [ ConfigService, HttpModule, LoggerService ],
})
export class SharedModule {}
