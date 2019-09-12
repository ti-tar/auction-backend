import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import * as moment from 'moment';

// DTO
import { CreateBidDto } from '../lots/dto/create-bid.dto';

@Injectable()
export class BidEditValidation implements PipeTransform<any, any> {
  transform(value: CreateBidDto, metadata: ArgumentMetadata): CreateBidDto {

    const { proposedPrice } = value;

    // console.log(proposedPrice);

    throw new HttpException([{
      message: '123 123 12',
    }], HttpStatus.BAD_REQUEST);

    return value;
  }
}
