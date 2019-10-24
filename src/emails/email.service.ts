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
      text: 'Hi! Reset pass on auction site. Your link: ' + `${resetPassLink}`,
      html: `<h1>Hi!</h1><p>Reset pass on auction site.</p><p><a href="${resetPassLink}">Reset email.</a></p>`,
    });
  }

  async sendBuyItNowToBuyer(userBidOwner, userLotOwner, lot): Promise<SentMessageInfo> {
    return this.sendEmail( {
      to: userBidOwner.email,
      subject: `You ve bidded over estimated price on lot ${lot.title}`,
      text: `Congratulations. You ve bidded over estimated price on lot '${lot.title}'`,
      html: `<h1>Congratulations!</h1><p>You ve bidded over estimated price on lot '${lot.title}'</p>`
      + `<p>We'll send you a mail with next step when lot's owner allow the deal.</p>`
      + `<p>You'll see delivery details on <a>lots page</a></p>`,
    });
  }

  async sendBuyItNowToOwner(userLotOwner, userBidOwner, lot): Promise<SentMessageInfo> {
    return this.sendEmail( {
      to: userLotOwner.email,
      subject: `User '${userBidOwner.firstName}' bidded over estimated price on lot '${lot.title}'(id: ${lot.id})`,
      text: `Auction user '${userBidOwner.firstName}' bidded over estimated price on lot '${lot.title}'(id: ${lot.id}).`
        + `Follow link to see delivery details.`,
      html: `<h1>Hi!</h1><p>Auction user '${userBidOwner.firstName}' bidded over estimated price on lot '${lot.title}'(id: ${lot.id})</p>`
        + `Follow <a href="">link</a> to see delivery details.`,
    });
  }

  async sendLotEndTimeToBuyer(owner, buyer, lot): Promise<SentMessageInfo> {
    const url = `${this.configService.config.frontendUrl}/lots/${lot.id}`;
    return this.sendEmail( {
      to: buyer.email,
      subject: `Lot '${lot.title}' end time has passed.`,
      text: `Lot '${lot.title}' end time has passed. Url ${url}` ,
      html: `<h1>H1</h1><p>Lot <a href="${url}">'${lot.title}'</a> end time has passed.</p><p>You are the winner.</p>`,
    });
  }

  async sendLotEndTimeToOwner(owner, lot): Promise<SentMessageInfo> {
    return this.sendEmail( {
      to: owner.email,
      subject: `Lot '${lot.title}' end time has passed.`,
      text: `Lot '${lot.title}' end time has passed.` ,
      html: `<h1>H1</h1><p>Lot '${lot.title}' end time has passed.</p><p>Please, follow <a>link</a> to find if there is any bids.</p>`,
    });
  }

  // async name(user, lot): Promise<SentMessageInfo> {
  //   return this.sendEmail( {
  //     from: this.from,
  //     to: user.email,
  //     subject: '',
  //     text: 'The' ,
  //     html: `text`,
  //   });
  // }

  async sendEmail(emailObject): Promise<SentMessageInfo> {
    try {
      return await this.transport.sendMail({from: this.from, ...emailObject});
    } catch (error) {
      this.loggerService.error(error);
      throw new NotImplementedException('Email not sent.');
    }
  }
}
