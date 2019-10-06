import { CreateUserDto } from '../auth/dto/create-user.dto';
import * as faker from 'faker';

export default {
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: faker.internet.email(),
  phone: faker.phone.phoneNumber('###########'),
  password: '123',

} as CreateUserDto;
