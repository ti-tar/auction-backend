import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as crypto from 'crypto';

import { SnakeNamingStrategy } from '../snake-naming.strategy';
import { User } from '../entities/user';
import { createHmac } from 'crypto';

declare const module: any;
declare const require: any;

@Injectable()
export class ConfigService {
  constructor(
    private readonly jwtService: JwtService,
  ) {
    const nodeEnv = this.nodeEnv;
    dotenv.config({
      path: `.${nodeEnv}.env`,
    });

    for (const envName of Object.keys(process.env)) {
      process.env[envName] = process.env[envName].replace(/\\n/g, '\n');
    }
  }

  public get(key: string): string {
    return process.env[key];
  }

  public getNumber(key: string): number {
    return Number(this.get(key));
  }

  get nodeEnv(): string {
    return this.get('NODE_ENV') || 'development';
  }

  public static generateRandomToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  public static getPasswordsHash(password: string): string {
    return createHmac('sha256', password).digest('hex');
  }

  getVerifyLink(token: string): string {
    return `${this.get('FRONTEND_URL')}auth/verify/email?token=${encodeURIComponent(token)}`;
  }

  getResetPasswordLink(token: string): string {
     return `${this.get('FRONTEND_URL')}auth/reset_email?token=${encodeURIComponent(token)}`;
  }

  generateJWT(user: User) {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return this.jwtService.sign({
      id: user.id,
      firstName: user.firstName,
      email: user.email,
      exp: exp.getTime() / 1000,
    });
  }

  get typeOrmConfig(): TypeOrmModuleOptions {
    let entities = [__dirname + '/../entities/**{.ts,.js}'];
    let migrations = [__dirname + '/../migrations/**{.ts,.js}'];

    if (module.hot) {
      const entityContext = require.context('./../entities', true, /\.ts$/);
      entities = entityContext.keys().map((id) => {
        const entityModule = entityContext(id);
        const [entity] = Object.values(entityModule);
        return entity;
      });

      const migrationContext = require.context('./../migrations', false, /\.ts$/);
      migrations = migrationContext.keys().map((id) => {
        const migrationModule = migrationContext(id);
        const [migration] = Object.values(migrationModule);
        return migration;
      });
    }

    return {
      entities,
      migrations,
      synchronize: true,
      keepConnectionAlive: true,
      type: 'postgres',
      host: this.get('POSTGRES_HOST'),
      port: this.getNumber('POSTGRES_PORT'),
      username: this.get('POSTGRES_USERNAME'),
      password: this.get('POSTGRES_PASSWORD'),
      database: this.get('POSTGRES_DATABASE'),
      migrationsRun: true,
      logging: this.nodeEnv === 'development',
      namingStrategy: new SnakeNamingStrategy(),
    };
  }
}
