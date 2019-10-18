import { Module, Global } from '@nestjs/common';
import { ConfigService } from './config.service';
import { LoggerService } from './logger.service';
import { EmailService } from '../emails/email.service';

@Global()
@Module({
    providers: [ ConfigService, LoggerService, EmailService ],
    exports: [ ConfigService, LoggerService, EmailService ],
})
export class SharedModule {}
