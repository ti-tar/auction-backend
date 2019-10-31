import { Processor, OnQueueEvent, BullQueueEvents, OnQueueActive, InjectQueue, Process } from 'nest-bull';
import { Job } from 'bull';
import { LoggerService } from '../shared/logger.service';
import { EMAILS, QUEUE_NAMES } from '../jobs/jobsList';
import { EmailService } from './email.service';

@Processor({ name: QUEUE_NAMES.EMAILS })
export class EmailsJobs {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly emailService: EmailService,
  ) {}

  @Process({ name: EMAILS.SEND_VERIFICATION_EMAIL })
  async sendVerificationEmail(job) {
    const { user } = job.data;
    const sentMail = await this.emailService.sendVerificationEmail(user);
    return `Email sent to ${sentMail.envelope.to.join(', ')}`;
  }

  @Process({ name: EMAILS.SEND_APPROVAL_EMAIL })
  async sendApprovalEmail(job) {
    const { user } = job.data;
    const sentMail = await this.emailService.sendApprovalEmail(user);
    return `Email sent to ${sentMail.envelope.to.join(', ')}`;
  }

  @Process({ name: EMAILS.SEND_FORGOT_PASSWORD_MAIL })
  async sendForgotPasswordMail(job) {
    const { user } = job.data;
    const sentMail = await this.emailService.sendForgotPasswordMail(user);
    return `Email sent to ${sentMail.envelope.to.join(', ')}`;
  }

  @Process({ name: EMAILS.BUY_IT_NOW_EMAIL_TO_CUSTOMER })
  async sendBuyItNowToCustomer(job) {
    const { customer, lot } = job.data;
    const sentMail = await this.emailService.sendBuyItNowToCustomer({ customer, lot });
    return `Email sent to ${sentMail.envelope.to.join(', ')}`;
  }

  @Process({ name: EMAILS.BUY_IT_NOW_EMAIL_TO_SELLER })
  async sendBuyItNowToSeller(job) {
    const { customer, seller, lot } = job.data;
    const sentMail = await this.emailService.sendBuyItNowToSeller({ customer, seller, lot });
    return `Email sent to ${sentMail.envelope.to.join(', ')}`;
  }

  @Process({ name: EMAILS.LOT_END_TIME_TO_CUSTOMER })
  async sendLotEndTimeToCustomer(job) {
    const { customer, lot } = job.data;
    const sentMail = await this.emailService.sendLotEndTimeToCustomer({ customer, lot });
    return `Email sent to ${sentMail.envelope.to.join(', ')}`;
  }

  @Process({ name: EMAILS.LOT_END_TIME_TO_SELLER })
  async sendLotEndTimeToSeller(job) {
    const { seller, lot } = job.data;
    const sentMail = await this.emailService.sendLotEndTimeToSeller({ seller, lot });
    return `Email sent to ${sentMail.envelope.to.join(', ')}`;
  }

  @Process({ name: EMAILS.ORDER_CREATED_EMAIL_TO_SELLER })
  async orderCreatedEmail(job) {
    const { user, lot } = job.data;
    const sentMail = await this.emailService.orderCreatedEmail({ user, lot });
    return `Email sent to ${sentMail.envelope.to.join(', ')}`;
  }

  @Process({ name: EMAILS.ORDER_UPDATED_EMAIL_TO_SELLER })
  async orderUpdatedEmail(job) {
    const { user, lot } = job.data;
    const sentMail = await this.emailService.orderUpdatedEmail({ user, lot });
    return `Email sent to ${sentMail.envelope.to.join(', ')}`;
  }

  @Process({ name: EMAILS.ORDER_EXECUTED_EMAIL_TO_CUSTOMER })
  async orderExecutedEmail(job) {
    const { user, lot } = job.data;
    const sentMail = await this.emailService.orderExecutedEmail({ user, lot });
    return `Email sent to ${sentMail.envelope.to.join(', ')}`;
  }

  @Process({ name: EMAILS.ORDER_RECEIVED_EMAIL_TO_SELLER })
  async orderReceivedEmail(job) {
    const { user, lot } = job.data;
    const sentMail = await this.emailService.orderReceivedEmail({ user, lot });
    return `Email sent to ${sentMail.envelope.to.join(', ')}`;
  }

  @OnQueueActive()
  onActive(job: Job<any>) {
    this.loggerService.log(`Processing email job: ${job.name} (${job.id})`);
  }

  @OnQueueEvent(BullQueueEvents.COMPLETED)
  onProcessCompleted(job: Job<any>) {
    this.loggerService.log(`Job ${job.name} completed! Result: ${job.returnvalue}`);
  }

  @OnQueueEvent(BullQueueEvents.FAILED)
  onProcessFailed(jobs: Job<any>) {
    this.loggerService.error(jobs.name);
  }
}
