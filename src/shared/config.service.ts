import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import { createHmac } from 'crypto';
import { SnakeNamingStrategy } from '../snake-naming.strategy';
import { User } from '../entities/user';

@Injectable()
export class ConfigService {
  constructor(
    private readonly jwtService: JwtService,
  ) {
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
