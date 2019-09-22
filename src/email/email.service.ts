import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '../shared/config.service';

interface MailOptions {
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
  ) {}

  sendEmail(mailOptions: MailOptions): void {
    // according to https://blog.mailtrap.io/sending-emails-with-nodemailer/

    const transport = nodemailer.createTransport({
      // todo from env too
      host: this.configService.get('MAILTRIP_HOST'),
      port: this.configService.getNumber('MAILTRIP_PORT'),
      auth: {
        user: this.configService.get('MAILTRIP_USER'),
        pass: this.configService.get('MAILTRIP_PASS'),
      },
    });

    const mergedMailOptions = {
      from: '', to: '', subject: 'Letter subject', text: '', html: '', ...mailOptions,
    };

    transport.sendMail(mergedMailOptions, (error, info) => {
      if (error) {
        // todo return console.log(error);
        console.log(error);
      }
      // todo smthng console.log('Email sent: ' + info.response);
      console.log(info);
    });
  }
}
