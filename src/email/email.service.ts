import { NotImplementedException, Injectable } from '@nestjs/common';
import { createTransport, SentMessageInfo } from 'nodemailer';
import { ConfigService } from '../shared/config.service';
import { LoggerService } from '../shared/logger.service';
import { User } from '../entities/user';
// import * as Mail from 'nodemailer/lib/mailer';
import * as SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class EmailService {

  transport: any;

  constructor(
    private readonly configService: ConfigService,
    private readonly loggerService: LoggerService,
  ) {
    this.transport = createTransport(this.configService.getEmailOptions());
  }

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

  async sendEmail(emailObject: SMTPTransport.Options): Promise<SentMessageInfo> {
    try {
      return await this.transport.sendMail(emailObject);
    } catch (error) {
      this.loggerService.error(error);
      throw new NotImplementedException('Email not sent.');
    }
  }
}
