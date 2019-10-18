// inspired by https://github.com/nestjs/nest/issues/507#issuecomment-374221089

import * as winston from 'winston';
import * as moment from 'moment';
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
          new winston.transports.File({ filename: 'logs/errors.development.log', level: 'error' }),
        ],
      },
    );
    this.prettyError.skipNodeFiles();
    this.prettyError.skipPackage('express', '@nestjs/common', '@nestjs/core');

    if (process.env.NODE_ENV !== 'production') {
      this.logger.add(new winston.transports.Console(
        {
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.printf(info => info.message),
          ),
        },
      ));
    }
  }

  log(message: string | number | boolean): void {
    this.logger.info(LoggerService.getColoredRows('info', String(message)));
  }

  error(errorOrMessage: any ): void { // todo change any letter
    this.logger.error(LoggerService.getColoredRows('error', `${errorOrMessage}`));

    if (errorOrMessage.stack && process.env.NODE_ENV !== 'production') {
      this.logger.error(this.prettyError.render(errorOrMessage));
    }
  }

  warn(message: string): void {
    this.logger.warn(message, LoggerService.getColoredRows('warn', message));
  }

  // this method makes colored log row for terminal
  private static getColoredRows(level: string, message: string): string {
    const color = chalk.default;
    const time = moment().format('YYYY, DD MMM, hh:mm:ss');

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
