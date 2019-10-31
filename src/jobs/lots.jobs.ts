import { Processor, OnQueueEvent, BullQueueEvents, OnQueueActive, InjectQueue, Process } from 'nest-bull';
import { Job, Queue } from 'bull';
import { LoggerService } from '../shared/logger.service';
import { JOBS, EMAILS, QUEUE_NAMES } from './jobsList';
import { LotsService } from '../lots/lots.service';
import { OrdersService } from '../orders/orders.service';
import { UsersService } from '../users/users.service';
import { BidsService } from '../bids/bids.service';
import { LotStatus } from '../entities/lot';
import { getWinnersBid } from '../libs/helpers';

@Processor({ name: QUEUE_NAMES.LOTS })
export class LotsJobs {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly lotsService: LotsService,
    private readonly ordersService: OrdersService,
    private readonly usersService: UsersService,
    private readonly bidsService: BidsService,
    @InjectQueue(QUEUE_NAMES.EMAILS) private readonly emailsQueue: Queue,
  ) {}

  @Process({ name: JOBS.LOT_END_TIME_JOB })
  async jobEndLotTime(job) {
    const { lotId } = job.data;

    const lot = await this.lotsService.findOne(lotId);
    await this.emailsQueue.add(EMAILS.LOT_END_TIME_TO_SELLER, { seller: lot.user, lot });

    lot.status = LotStatus.closed;
    await this.lotsService.save(lot);

    const winnersBid = getWinnersBid(lot.bids);

    if (winnersBid) {
      const customer = await this.usersService.findOne(winnersBid.user.id);
      await this.emailsQueue.add(EMAILS.LOT_END_TIME_TO_CUSTOMER, { customer, seller: lot.user, lot });
    }

    return this.loggerService.log(`Job ${job.name} processed`);
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
