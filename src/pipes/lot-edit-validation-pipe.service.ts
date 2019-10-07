import { ArgumentMetadata, Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import * as moment from 'moment';

@Injectable()
export class LotEditValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata) {

    const { currentPrice, estimatedPrice, endTime } = value;

    if (estimatedPrice <= currentPrice) {
      throw new BadRequestException('Estimated price should be less or equal then current.');
    }

    const startTimeDate = moment();
    const endTimeDate = moment(endTime);

    if (!startTimeDate.isValid() || !endTimeDate.isValid() ) {
      throw new BadRequestException('Lot start or end time is not valid.');
    }

    if (!endTimeDate.isAfter(startTimeDate.toISOString())) {
      throw new BadRequestException('End of lot\'s bidding should not be later it start.');
    }

    return value;
  }
}
