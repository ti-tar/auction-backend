import { Processor, OnQueueEvent, BullQueueEvents, OnQueueActive, InjectQueue, Process } from 'nest-bull';
import { Job } from 'bull';
import { LoggerService } from '../shared/logger.service';
import { JOBS, QUEUE_NAMES } from './jobsList';

@Processor({ name: QUEUE_NAMES.LOTS })
export class LotsJobs {
  constructor(
    private readonly loggerService: LoggerService,
  ) {}

  @Process({ name: JOBS.LOT_END_TIME_JOB })
  async jobEndLotTime(job) {
    // console.log(JOBS.LOT_END_TIME_JOB);
    // console.log(job);
    return this.loggerService.log(`--- Job ${job.name} processed`);
  }

  @Process({ name: JOBS.LOT_BUY_IT_NOW_JOB })
  async jobBuyItNow(job) {
    // console.log(JOBS.LOT_BUY_IT_NOW_JOB);
    // console.log(job);
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
