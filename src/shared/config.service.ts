import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { randomBytes, createHmac } from 'crypto';
import { SnakeNamingStrategy } from '../snake-naming.strategy';

@Injectable()
export class ConfigService {
  constructor() {
    this.nodeEnv = 'production'; // this.get('NODE_ENV') || 'development';
    dotenv.config({ path: `.env.${this.nodeEnv}` });
    for (const envName of Object.keys(process.env)) {
      process.env[envName] = process.env[envName].replace(/\\n/g, '\n');
    }
  }

  nodeEnv;

  public get(key: string): string {
    return process.env[key];
  }
  public getNumber(key: string): number {
    return parseInt(process.env[key], 10);
  }

  getEmailOptions() {
    return {
      host: this.get('MAILTRIP_HOST'),
      port: this.getNumber('MAILTRIP_PORT'),
      auth: {
        user: this.get('MAILTRIP_USER'),
        pass: this.get('MAILTRIP_PASS'),
      },
    };
  }

  get config() {
    return {
      frontendUrl: this.get('FRONTEND_URL'),
      email: this.get('EMAIL'),
      pagination: {
        perPage: parseInt(this.get('PAGINATION_PER_PAGE'), 10),
        page: 1,
      },
      configRedis: {
        host: this.get('REDIS_HOST'),
        password: this.get('REDIS_PASSWORD'),
        port: this.getNumber('REDIS_PORT'),
      },
      jwt: {
        secretKey: this.get('JWT_SECRET_KEY'),
        expirationTime: this.getNumber('JWT_EXPIRATION_TIME'),
      },
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
