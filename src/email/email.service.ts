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

  get from() {
    return `Auction Team <${this.configService.config.email}>`;
  }

  constructor(
    private readonly configService: ConfigService,
    private readonly loggerService: LoggerService,
  ) {
    this.transport = createTransport(this.configService.getEmailOptions());
  }

  async sendVerificationEmail(user: User): Promise<SentMessageInfo> {
    const verifyLink = this.configService.getVerifyLink(user.token);
    return this.sendEmail( {
      from: this.from,
      to: user.email,
      subject: 'Letter to verify your registration',
      text: 'Hi! To complete registration follow link: ' + `${verifyLink}`,
      html: `<h1>Hi!</h1><p>To complete registration follow link:</p><p><a href="${verifyLink}">Verify email.</a></p>`,
    });
  }

  async sendApprovalEmail(user: User): Promise<SentMessageInfo> {
    return this.sendEmail( {
      from: this.from,
      to: user.email,
      subject: 'You were verified!',
      text: 'Hi! You were verified. Thank you',
      html: `<h1>Hi!</h1><p>You were verified. Thank you</p>`,
    });
  }

  async sendForgotPasswordMail(user: User): Promise<SentMessageInfo> {
    const resetPassLink = this.configService.getResetPasswordLink(user.token);
    return this.sendEmail( {
      from: this.from,
      to: user.email,
      subject: 'Email to reset password.',
      text: 'Hi! Reset pass on auction site. Your link: ' + `${resetPassLink}`,
      html: `<h1>Hi!</h1><p>Reset pass on auction site.</p><p><a href="${resetPassLink}">Reset email.</a></p>`,
    });
  }

  async sendYouWinMailOnBuyItNowToBidOwner(userBidOwner, userLotOwner, lot): Promise<SentMessageInfo> {
    this.loggerService.log(`EmailService: sendYouWinMailOnBuyItNowToBidOwner method`);
    return this.sendEmail( {
      from: this.from,
      to: userBidOwner.email,
      subject: `You ve bidded over estimated price on lot ${lot.title}`,
      text: `Congratulations. You ve bidded over estimated price on lot ${lot.title}`,
      html: `<h1>Congratulations!</h1><p>You ve bidded over estimated price on lot ${lot.title}</p>`
      + `<p>We'll send you a mail with next step when lot's owner allow the deal.</p>`
      + `<p>You'll see delivery details on <a>lots page</a></p>`,
    });
  }

  async sendYourLotWonMailOnBuyItNowToLotOwner(userLotOwner, userBidOwner, lot): Promise<SentMessageInfo> {
    this.loggerService.log(`EmailService: sendYourLotWonMailOnBuyItNowToLotOwner method`);
    return this.sendEmail( {
      from: this.from,
      to: userLotOwner.email,
      subject: `User '${userBidOwner.firstName}' bidded over estimated price on lot '${lot.title}'(id: ${lot.id})`,
      text: `Auction user '${userBidOwner.firstName}' bidded over estimated price on lot '${lot.title}'(id: ${lot.id}).`
        + `Follow link to see delivery details.`,
      html: `<h1>Hi!</h1><p>Auction user '${userBidOwner.firstName}' bidded over estimated price on lot '${lot.title}'(id: ${lot.id})</p>`
        + `Follow <a href="">link</a> to see delivery details.`,
    });
  }

  // async name(user, lot): Promise<SentMessageInfo> {
  //   return this.sendEmail( {
  //     from: this.from,
  //     to: user.email,
  //     subject: '',
  //     text: 'The' ,
  //     html: `dfohjspdfogjp`,
  //   });
  // }

  async sendEmail(emailObject: SMTPTransport.Options): Promise<SentMessageInfo> {
    try {
      return await this.transport.sendMail(emailObject);
    } catch (error) {
      this.loggerService.error(error);
      throw new NotImplementedException('Email not sent.');
    }
  }
}
