import * as faker from 'faker';
import { User, Status as StatusEnum } from '../entities/user';
import { Injectable } from '@nestjs/common';
import { LoggerService } from '../shared/logger.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class SeederService {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly userService: UsersService,
  ) {}

  async seed() {
    const u = await this.userService.save(this.getUser(new User()));
  }

  private getUser(newUser) {
    newUser.email = faker.internet.email();
    newUser.phone = faker.phone.phoneNumber('###########');
    newUser.password = '123';
    newUser.firstName = faker.name.firstName();
    newUser.lastName = faker.name.lastName();
    newUser.status = faker.random.arrayElement(Object.getOwnPropertyNames(StatusEnum));
    newUser.token = null;
    newUser.lots = null;
    newUser.bids = null;
    return newUser;
  }
}
