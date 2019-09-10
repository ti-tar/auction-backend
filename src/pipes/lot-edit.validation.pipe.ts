import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import * as moment from 'moment';

// DTO
import { CreateLotDto } from '../lots/dto/create-lot.dto';

@Injectable()
export class LotEditValidation implements PipeTransform<any, any> {
  transform(value: CreateLotDto, metadata: ArgumentMetadata): CreateLotDto {

    const { currentPrice, estimatedPrice, startTime, endTime } = value;

    if (estimatedPrice <= currentPrice) {
      throw new HttpException([{
        message: 'Estimated price should be less or equal then current.',
      }], HttpStatus.BAD_REQUEST);
    }

    const startTimeDate = moment(startTime);
    const endTimeDate = moment(endTime);

    if (!startTimeDate.isValid() || !endTimeDate.isValid() ) {
      throw new HttpException([{
        message: 'Lot start or end time is not valid.',
      }], HttpStatus.BAD_REQUEST);
    }

    // todo - here is a problem while updating
    if (!endTimeDate.isAfter(startTimeDate)) {
      throw new HttpException([{
        message: 'End of lot\'s bidding should not be earlier it start.',
      }], HttpStatus.BAD_REQUEST);
    }

    return value;
  }
}
