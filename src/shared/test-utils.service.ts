import { Injectable } from '@nestjs/common';

import * as Path from 'path';
import * as fs from 'fs';

import { DatabaseService } from '../../test/database/database.service';
import { LoggerService } from './logger.service';
import { EntityMetadata } from 'typeorm';

@Injectable()
export class TestUtilsService {

  databaseService;
  loggerService;

  constructor(
    databaseService: DatabaseService,
    loggerService: LoggerService,
  ) {
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('Seeder uses only in test mode.');
    }
    this.databaseService = databaseService;
    this.loggerService = loggerService;
  }

  async reloadDatabase() {
    this.loggerService.log('Clear DB...');
    const entities = await this.getEntities();
    await this.truncateAll(entities);

    // await this.loadAll(entities);
  }

  async getEntities(): Promise<EntityMetadata[]> {
    return (await this.databaseService.connection).entityMetadatas;
  }

  // it clears migrations' table too!!!
  async dropAndSync() {
    try {
     await this.databaseService.connection.dropDatabase();
     await this.databaseService.connection.synchronize();
    } catch (error) {
      this.loggerService.error(`Error occurred during cleaning test db: ${error}`);
      throw new Error(`ERROR: Cleaning test db: ${error}`);
    }
  }

  async truncateAll(entities: EntityMetadata[]) {
    for (const entity of entities) {
      const { name, tableName } = entity;
      const repository = await this.databaseService.getRepository(name);
      try {
        await repository.query(`TRUNCATE TABLE ${tableName} CASCADE; ALTER SEQUENCE ${tableName}_id_seq RESTART WITH 1;`);
        this.loggerService.log(`NODE_ENV: ${process.env.NODE_ENV}, truncate table: ${tableName}`);
      } catch (error) {
        this.loggerService.error(`Error occurred during cleaning test db: ${error}`);
        throw new Error(`ERROR: Cleaning test db: ${error}`);
      }
    }
  }

  async loadAll(entities) {
    try {
      for (const entity of entities) {
        const repository = await this.databaseService.getRepository(entity.name);
        const fixtureFile = Path.join(__dirname, `../test/fixtures/${entity.name}.json`);
        if (fs.existsSync(fixtureFile)) {
          const items = JSON.parse(fs.readFileSync(fixtureFile, 'utf8'));
          await repository
            .createQueryBuilder(entity.name)
            .insert()
            .values(items)
            .execute();
        }
      }
    } catch (error) {
      throw new Error(`ERROR [TestUtils.loadAll()]: Loading fixtures on test db: ${error}`);
    }
  }
}
