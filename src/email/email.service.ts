import { NotImplementedException, Injectable } from '@nestjs/common';
import { createTransport, SentMessageInfo } from 'nodemailer';
import { ConfigService } from '../shared/config.service';
import { LoggerService } from '../shared/logger.service';
import { User } from '../entities/user';

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
    private readonly loggerService: LoggerService,
  ) {}

  async sendVerificationEmail(user: User): Promise<SentMessageInfo> {
    const verifyLink = this.configService.getVerifyLink(user.token);

    return this.sendEmail( {
      from: 'Auction Team <from@example.com>',
      to: user.email,
      subject: 'Letter to verify your registration',
      text: 'Hi! To complete registration follow link: ' + `${verifyLink}`,
      html: `<h1>Hi!</h1><p>To complete registration follow link:</p><p><a href="${verifyLink}">Verify email.</a></p>`,
    });
  }

  async sendApprovalEmail(user: User): Promise<SentMessageInfo> {
    return this.sendEmail( {
      from: 'Auction Team <from@example.com>',
      to: user.email,
      subject: 'You were verified!',
      text: 'Hi! You were verified. Thank you',
      html: `<h1>Hi!</h1><p>You were verified. Thank you</p>`,
    });
  }

  async sendForgotPasswordMail(user: User): Promise<SentMessageInfo> {
    const resetPassLink = this.configService.getResetPasswordLink(user.token);
    return this.sendEmail( {
      from: 'Auction Team <from@example.com>',
      to: user.email,
      subject: 'Email to reset password.',
      text: 'Hi! Reset pass on auction site. Your link: ' + `${resetPassLink}`,
      html: `<h1>Hi!</h1><p>Reset pass on auction site.</p><p><a href="${resetPassLink}">Reset email.</a></p>`,
    });
  }

  private async sendEmail(emailObject: MailObject): Promise<SentMessageInfo> {

    const transportOptions = {
      host: this.configService.get('MAILTRIP_HOST'),
      port: this.configService.getNumber('MAILTRIP_PORT'),
      auth: {
        user: this.configService.get('MAILTRIP_USER'),
        pass: this.configService.get('MAILTRIP_PASS'),
      },
    };

    const transport = createTransport(transportOptions);

    try {
      return await transport.sendMail(emailObject);
    } catch (error) {
      this.loggerService.error(error);
      throw new NotImplementedException('Email not sent.');
    }
  }
}
