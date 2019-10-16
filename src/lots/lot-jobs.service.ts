import { Processor, OnQueueEvent, BullQueueEvents, OnQueueActive, InjectQueue, Process } from 'nest-bull';
import { Job, JobOptions, Queue as QueueType } from 'bull';
import { LoggerService } from '../shared/logger.service';

export const lotQueueName = 'lot-jobs';

@Processor({ name: lotQueueName })
export class LotJobsService {
  constructor(
    @InjectQueue(lotQueueName) readonly queue: QueueType,
    private readonly loggerService: LoggerService,
  ) {}

  async addJob(name: string, data: any, opts?: JobOptions) {
    this.loggerService.log(`Start job ${name}...`);
    const job = await this.queue.add(name, data, opts);
    this.loggerService.log(`Job ${job.name} added to queue '${lotQueueName}'`);
  }

  @Process({ name: 'setEndLotTimeJob' })
  async processLotsCreated(job) {
    // const lot = await this.lotsService.findOne({ where: {id : job.data.id}, relations: ['user', 'bids'] });
    // if (lot.status === 'inProcess') {
    //   lot.status = 'closed';
    //   await this.lotsService.save(lot);
    // }
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
