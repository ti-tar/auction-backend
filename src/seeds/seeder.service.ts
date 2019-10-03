import * as faker from 'faker';

import { Status as StatusEnum } from '../entities/user';
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

    const users = [];
    for (let i = 0; i < faker.random.number({ min: 30, max: 50 }) ; i++ ) {
      users.push(this.getUser());
    }

    this.loggerService.log('Saving users...');
    try {
      this.saveEntitiesToDb('users', users);
    } catch (errors) {
      this.loggerService.error(errors);
      throw new Error(errors);
    }

    this.loggerService.log('Generating lots by users who approved...');
    this.loggerService.log('Saving lots...');

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

  private getUser() {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const email = faker.internet.email( firstName, lastName );
    const status = faker.random.arrayElement(Object.getOwnPropertyNames(StatusEnum));
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
}
