import { NotImplementedException, Injectable } from '@nestjs/common';
import { createTransport, SentMessageInfo } from 'nodemailer';
import { ConfigService } from '../shared/config.service';
import { LoggerService } from '../shared/logger.service';

interface MailObject {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

@Injectable()
export class EmailService {

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {}

  async sendEmail(emailObject: MailObject): Promise<SentMessageInfo> {
    // according to https://blog.mailtrap.io/sending-emails-with-nodemailer/

    const transportOptions = {
      host: this.configService.get('MAILTRIP_HOST'),
      port: this.configService.getNumber('MAILTRIP_PORT'),
      auth: {
        user: this.configService.get('MAILTRIP_USER'),
        pass: ' ', // this.configService.get('MAILTRIP_PASS'),
      },
    };

    const transport = createTransport(transportOptions);

    try {
      return await transport.sendMail(emailObject);
    } catch (error) {
      this.logger.error(error);
      throw new NotImplementedException('Email not sent.');
    }
  }
}
