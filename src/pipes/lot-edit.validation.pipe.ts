import { ArgumentMetadata, Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import * as moment from 'moment';

@Injectable()
export class LotEditValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata) {

    const { currentPrice, estimatedPrice, endTime } = value;

    if (currentPrice < 0) {
      throw new BadRequestException('Current price should be greater than zero.');
    }
    if (estimatedPrice <= currentPrice) {
      throw new BadRequestException('Estimated price should be less or equal then current.');
    }
    const endTimeDate = moment(endTime);

    if (!endTimeDate.isValid()) {
      throw new BadRequestException('End time is not valid.');
    }

    if (!endTimeDate.isAfter(moment().toISOString())) {
      throw new BadRequestException('End of lot\'s bidding should not be later it start.');
    }

    return value;
  }
}
