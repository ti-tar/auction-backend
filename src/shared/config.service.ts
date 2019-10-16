import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { randomBytes, createHmac } from 'crypto';
import { SnakeNamingStrategy } from '../snake-naming.strategy';


@Injectable()
export class ConfigService {
  constructor() {
    this.nodeEnv = this.get('NODE_ENV') || 'development';
    dotenv.config({ path: `.env.${this.nodeEnv}` });
    for (const envName of Object.keys(process.env)) {
      process.env[envName] = process.env[envName].replace(/\\n/g, '\n');
    }
  }

  nodeEnv;

  public get(key: string): string {
    return process.env[key];
  }

  getEmailOptions() {
    return {
      host: this.get('MAILTRIP_HOST'),
      port: parseInt(this.get('MAILTRIP_PORT'), 10),
      auth: {
        user: this.get('MAILTRIP_USER'),
        pass: this.get('MAILTRIP_PASS'),
      },
    };
  }

  get pagination() {
    return {
      perPage: parseInt(this.get('PAGINATION_PER_PAGE'), 10),
      page: 1,
    };
  }

  public static generateRandomToken(): string {
    return randomBytes(32).toString('hex');
  }

  public static getPasswordsHash(password: string): string {
    return createHmac('sha256', password).digest('hex');
  }

  public getLotCoverPath(filename: string): string {
    return `upload/images/lots/thumb/${filename}`;
  }

  public lotCoverThumbWidth: 200;

  getVerifyLink(token: string): string {
    return `${this.get('FRONTEND_URL')}auth/verify/email?token=${encodeURIComponent(token)}`;
  }

  getResetPasswordLink(token: string): string {
     return `${this.get('FRONTEND_URL')}auth/reset_email?token=${encodeURIComponent(token)}`;
  }

  get typeOrmConfig(): TypeOrmModuleOptions {
    return {
      synchronize: true,
      keepConnectionAlive: true,
      type: 'postgres',
      host: this.get('POSTGRES_HOST'),
      port: parseInt(this.get('POSTGRES_PORT'), 10),
      username: this.get('POSTGRES_USERNAME'),
      password: this.get('POSTGRES_PASSWORD'),
      database: this.get('POSTGRES_DATABASE'),
      migrationsRun: true,
      logging: this.get('NODE_ENV') === 'development',
      namingStrategy: new SnakeNamingStrategy(),
      entities: [__dirname + '/../entities/**{.ts,.js}'],
      migrations: [__dirname + '/../migrations/**{.ts,.js}'],
      cli: {
        migrationsDir: `${__dirname}/../migrations/`,
      },
    };
  }
}
