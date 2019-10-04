import * as faker from 'faker';

import { Status as UserStatusEnum } from '../entities/user';
import { Status as LotsStatusEnum } from '../entities/lot';
import { Injectable } from '@nestjs/common';
import { LoggerService } from '../shared/logger.service';
import { DatabaseService } from '../../test/database/database.service';
import { ConfigService } from '../shared/config.service';

@Injectable()
export class SeederService {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly databaseService: DatabaseService,
  ) {
    if (process.env.NODE_ENV !== 'test') {
      this.loggerService.error('Seeder uses only in test mode.');
      throw new Error('Seeder uses only in test mode.');
    }
  }

  async seed() {

    this.loggerService.log('Generate users...');
    const users = this.emptyArray(20, 50).map(() => this.getUser());

    this.loggerService.log('Saving users...');
    try {
      await this.saveEntitiesToDb('users', users);
      this.loggerService.log(`Users count ${users.length}`);
    } catch (errors) {
      this.loggerService.error(errors);
      throw new Error(errors);
    }

    this.loggerService.log('Generating lots by users who approved...');
    const lots = this.emptyArray(100, 200).map(() => this.getLots());
    this.loggerService.log('Saving lots...');
    try {
      await this.saveEntitiesToDb('lots', lots);
      this.loggerService.log(`Lots count ${lots.length}`);
    } catch (errors) {
      this.loggerService.error(errors);
      throw new Error(errors);
    }

    this.loggerService.log('Generating bids for lots...');
    this.loggerService.log('Saving bids...');

    this.loggerService.log('Generating orders...');
    this.loggerService.log('Saving orders...');
  }

  private async saveEntitiesToDb(entityName: string, entities: any[]): Promise<void> {
    this.loggerService.log(`Seed '${entityName}' data.`);
    const u = await this.databaseService.getRepository(entityName);
    await u.createQueryBuilder(entityName)
      .insert()
      .values(entities)
      .execute();
  }

  private emptyArray(min: number, max: number): null[] {
    return Array.apply(null, {length: faker.random.number({ min, max })});
  }

  private getUser() {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const email = faker.internet.email( firstName, lastName );
    const status = faker.random.arrayElement(Object.getOwnPropertyNames(UserStatusEnum));
    const password = ConfigService.getPasswordsHash('123');
    const token = status === 'pending' ? ConfigService.generateRandomToken() : null;
    return {
      email,
      firstName,
      lastName,
      password,
      token,
      phone: faker.phone.phoneNumber('###########'),
      status,
      lots: null,
      bids: null,
    };
  }

  private getLots() {

    const today = new Date();
    const startTimeMin = new Date();
    const startTimeMax = new Date();
    const endTimeMin = new Date();
    const endTimeMax = new Date();
    startTimeMin.setDate(today.getDate() - 3);
    startTimeMax.setDate(today.getDate() + 3);
    endTimeMin.setDate(today.getDate() + 4);
    endTimeMax.setDate(today.getDate() + 30);

    const startTime = faker.date.between(startTimeMin, startTimeMax).toISOString();
    const endTime = faker.date.between(endTimeMin, endTimeMax).toISOString();

    return {
      title: faker.commerce.product(),
      image: faker.system.commonFileName('jpg'),
      description: faker.lorem.paragraph(),
      status: faker.random.arrayElement(Object.getOwnPropertyNames(LotsStatusEnum)),
      currentPrice: faker.commerce.price(50, 999),
      estimatedPrice: faker.commerce.price(1000, 9999),
      startTime,
      endTime,
      user: null,
      bids: null,
    };
  }
}
