import { NotImplementedException, Injectable } from '@nestjs/common';
import { createTransport, SentMessageInfo } from 'nodemailer';
import { ConfigService } from '../shared/config.service';
import { LoggerService } from '../shared/logger.service';
import { User } from '../entities/user';

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
      to: user.email,
      subject: 'Letter to verify your registration',
      text: 'Hi! To complete registration follow link: ' + `${verifyLink}`,
      html: `<h1>Hi!</h1><p>To complete registration follow link:</p><p><a href="${verifyLink}">Verify email.</a></p>`,
    });
  }

  async sendApprovalEmail(user: User): Promise<SentMessageInfo> {
    return this.sendEmail( {
      to: user.email,
      subject: 'You were verified!',
      text: 'Hi! You were verified. Thank you',
      html: `<h1>Hi!</h1><p>You were verified. Thank you</p>`,
    });
  }

  async sendForgotPasswordMail(user: User): Promise<SentMessageInfo> {
    const resetPassLink = this.configService.getResetPasswordLink(user.token);
    return this.sendEmail( {
      to: user.email,
      subject: 'Email to reset password.',
      text: `Hello, ${user.firstName}! Reset pass on auction site. Your link: ` + `${resetPassLink}`,
      html: `<h1>Hello, ${user.firstName}!</h1><p>Reset pass on auction site.</p>` +
        `<p><a href="${resetPassLink}">Reset email.</a></p>`,
    });
  }

  async sendBuyItNowToCustomer({ customer, lot }): Promise<SentMessageInfo> {
    return this.sendEmail( {
      to: customer.email,
      subject: `Your bid has won lot ${lot.title}`,
      text: `Congratulations. You ve bidded over estimated price on lot '${lot.title}'`,
      html: `<h1>Congratulations!</h1><p>You ve bidded over estimated price on lot '${lot.title}'</p>`
      + `<p>Checkout the order on <a target="_blank" href="${this.configService.get('FRONTEND_URL')}lots/${lot.id}">lot's page</a></p>`,
    });
  }

  async sendBuyItNowToSeller({ customer, seller, lot }): Promise<SentMessageInfo> {
    return this.sendEmail( {
      to: seller.email,
      subject: `User '${customer.firstName}' bidded over estimated price on lot '${lot.title}'(id: ${lot.id})`,
      text: `Auction user '${customer.firstName}' bidded over estimated price on lot '${lot.title}'(id: ${lot.id}).`
        + `Follow link to see delivery details.`,
      html: `<h1>Hi!</h1><p>Auction user '${customer.firstName}' bidded over estimated price on lot '${lot.title}'(id: ${lot.id})</p>`
        + `Follow <a href="">link</a> to see delivery details.`,
    });
  }

  async sendLotEndTimeToCustomer({ customer, lot }): Promise<SentMessageInfo> {
    const url = `${this.configService.config.frontendUrl}/lots/${lot.id}`;
    return this.sendEmail( {
      to: customer.email,
      subject: `Lot '${lot.title}' end time has passed.`,
      text: `Lot '${lot.title}' end time has passed. Url ${url}` ,
      html: `<h1>Hello, ${customer.title}!</h1><p>Lot <a href="${url}">'${lot.title}'</a> end time has passed.</p><p>You are the winner.</p>`,
    });
  }

  async sendLotEndTimeToSeller({ seller, lot }): Promise<SentMessageInfo> {
    return this.sendEmail( {
      to: seller.email,
      subject: `Your lot '${lot.title}' end time has passed.`,
      text: `Your lot '${lot.title}' end time has passed.` ,
      html: `<h1>Hello, ${seller.title}</h1><p>Lot '${lot.title}' end time has passed.</p>` +
        `<p>Please, follow <a target="_blank" href="${this.configService.get('FRONTEND_URL')}lots/${lot.id}">link</a> to check it.</p>`,
    });
  }

  async orderCreatedEmail({ user, lot }): Promise<SentMessageInfo> {
    return this.sendEmail({
      to: user.email,
      subject: `Order (lot '${lot.title}') is created!`,
      text: `Dear ${user.firstName}. Order for your lot '${lot.title}' created!` ,
      html: `<h1>Dear ${user.firstName}</h1>` +
        `<p>Order '${lot.title}' created!</p>` +
        `<p>Follow '<a target="_blank" href="${this.configService.get('FRONTEND_URL')}lots/${lot.id}">link</a>' to execute an order!</p>`,
    });
  }

  async orderUpdatedEmail({ user, lot }): Promise<SentMessageInfo> {
    return this.sendEmail({
      to: user.email,
      subject: `Order (lot '${lot.title}') updated!`,
      text: `Dear ${user.firstName}. Pay attention. Order for your lot '${lot.title}' updated!` ,
      html: `<h1>Dear ${user.firstName}</h1>` +
        `<p>Pay attention.</p><p>Order '${lot.title}' updated!</p>` +
        `<p>Follow '<a target="_blank" href="${this.configService.get('FRONTEND_URL')}lots/${lot.id}">link</a>' to check changes!</p>`,
    });
  }

  async orderExecutedEmail({ user, lot }): Promise<SentMessageInfo> {
    return this.sendEmail( {
      to: user.email,
      subject: `Order (lot '${lot.title}') is executed!`,
      text: `Dear ${user.firstName}. Order '${lot.title}' executed!` ,
      html: `<h1>Dear ${user.firstName}</h1>` +
        `<p>Order '<a target="_blank" href="${this.configService.get('FRONTEND_URL')}lots/${lot.id}">${lot.title}</a>' executed!</p>`,
    });
  }

  async orderReceivedEmail({ user, lot }): Promise<SentMessageInfo> {
    return this.sendEmail( {
      to: user.email,
      subject: `Order (lot '${lot.title}') is received!`,
      text: `Dear ${user.firstName}. Order '${lot.title}' received!` ,
      html: `<h1>Dear ${user.firstName}</h1>` +
        `<p>Order <a target="_blank" href="${this.configService.get('FRONTEND_URL')}lots/${lot.id}">${lot.title}</a> received!</p>`,
    });
  }

  async sendEmail(emailObject): Promise<SentMessageInfo> {
    try {
      return await this.transport.sendMail({from: this.from, ...emailObject});
    } catch (error) {
      this.loggerService.error(error);
      throw new NotImplementedException('Email not sent.');
    }
  }
}
