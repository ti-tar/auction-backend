// inspired by https://github.com/nestjs/nest/issues/507#issuecomment-374221089

import * as winston from 'winston';
import * as chalk from 'chalk';
import * as PrettyError from 'pretty-error';
// @ts-ignore
import { LoggerInstance, LoggerOptions } from 'winston';

export class LoggerService {

  private readonly logger: LoggerInstance;
  private readonly prettyError = new PrettyError();

  constructor() {
    this.logger = winston.createLogger(
      {
        transports: [
          // new winston.transports.Console(),
          new winston.transports.File({ filename: 'logs/errors.development.log', level: 'error' }),
        ],
      },
    );
    this.prettyError.skipNodeFiles();
    this.prettyError.skipPackage('express', '@nestjs/common', '@nestjs/core');
  }

  log(message: string): void {
    const currentDate = new Date();
    this.logger.info(message, {
      timestamp: currentDate.toISOString(),
    });
    this.formattedLog('info', message);
  }

  error(message: string, trace?: any): void {
    const currentDate = new Date();

    this.logger.error(
      `${message} -> (${trace || 'trace not provided !'})`,
      {
        timestamp: currentDate.toISOString(),
      },
    );

    if (trace && process.env.NODE_ENV === 'development') {
      this.prettyError.render(trace, true);
    }

    this.formattedLog('error', message);
  }

  warn(message: string): void {
    const currentDate = new Date();
    this.logger.warn(message, {
      timestamp: currentDate.toISOString(),
    });
    this.formattedLog('warn', message);
  }

  // this method prints a log in terminal
  private formattedLog(level: string, message: string): void {
    console.log(this.getColoredRows(level, message));
  }

  // this method prints a log in terminal
  private getColoredRows(level: string, message: string): string {

    const color = chalk.default;
    const currentDate = new Date();
    const time = `${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;

    switch (level) {
      case 'info':
        return `[${color.blue('INFO')}] ${color.dim.yellow.bold.underline(time)} ${message}`;
      case 'error':
        return `[${color.red('ERROR')}] ${color.dim.yellow.bold.underline(time)} ${message}`;
      case 'warn':
        return `[${color.yellow('WARN')}] ${color.dim.yellow.bold.underline(time)} ${message}`;
      default:
        return '';
    }
  }
}
