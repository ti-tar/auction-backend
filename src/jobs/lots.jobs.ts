import { Processor, OnQueueEvent, BullQueueEvents, OnQueueActive, InjectQueue, Process } from 'nest-bull';
import { Job, Queue } from 'bull';
import { LoggerService } from '../shared/logger.service';
import { JOBS, EMAILS, QUEUE_NAMES } from './jobsList';
import { LotsService } from '../lots/lots.service';
import { OrdersService } from '../orders/orders.service';
import { UsersService } from '../users/users.service';

@Processor({ name: QUEUE_NAMES.LOTS })
export class LotsJobs {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly lotsService: LotsService,
    private readonly ordersService: OrdersService,
    private readonly usersService: UsersService,
    @InjectQueue(QUEUE_NAMES.EMAILS) private readonly emailsQueue: Queue,
  ) {}

  @Process({ name: JOBS.LOT_END_TIME_JOB })
  async jobEndLotTime(job) {
    const { lotId } = job.data;

    const lot = await this.lotsService.findOne(lotId);
    const owner = await this.usersService.findOne(lot.user.id);
    await this.emailsQueue.add(EMAILS.EMAIL_LOT_END_TIME_OWNER, { owner, lot }, { attempts: 5 });

    lot.status = 'closed';
    await this.lotsService.save(lot);

    if (lot.bids && lot.bids.length) {
      const bidWinnerId = lot.bids[lot.bids.length - 1].user.id;
      const buyer = await this.usersService.findOne(bidWinnerId);
      await this.emailsQueue.add(EMAILS.EMAIL_LOT_END_TIME_BUYER, { buyer, owner, lot }, { attempts: 5 });
      await this.ordersService.create();
    }

    return this.loggerService.log(`--- Job ${job.name} processed`);
  }

  @OnQueueActive()
  onActive(job: Job<any>) {
    this.loggerService.log(`Processing job ${job.id} of type ${job.name} with data ${job.data}...`);
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
