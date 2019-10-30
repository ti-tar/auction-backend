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

  @Process({ name: EMAILS.EMAIL_BUY_IT_NOW_BETTING_USER })
  async buyItNowToBuyer(job) {
    const { buyer, owner, lot } = job.data;
    const sentMail = await this.emailService.sendBuyItNowToBuyer(buyer, owner, lot);
    return `Email sent to ${sentMail.envelope.to.join(', ')}`;
  }

  @Process({ name: EMAILS.EMAIL_BUY_IT_NOW_LOT_OWNER })
  async buyItNowToOwner(job) {
    const { owner, buyer, lot } = job.data;
    const sentMail = await this.emailService.sendBuyItNowToOwner(owner, buyer, lot);
    return `Email sent to ${sentMail.envelope.to.join(', ')}`;
  }

  @Process({ name: EMAILS.EMAIL_LOT_END_TIME_BUYER })
  async sendLotEndTimeToBuyer(job) {
    const { buyer, owner, lot } = job.data;
    const sentMail = await this.emailService.sendLotEndTimeToBuyer(buyer, owner, lot);
    return `Email sent to ${sentMail.envelope.to.join(', ')}`;
  }

  @Process({ name: EMAILS.EMAIL_LOT_END_TIME_OWNER })
  async sendLotEndTimeToOwner(job) {
    const { owner, lot } = job.data;
    const sentMail = await this.emailService.sendLotEndTimeToOwner(owner, lot);
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
