import { ArgumentMetadata, HttpException, HttpStatus, Injectable,
  PipeTransform, BadRequestException } from '@nestjs/common';

// DTO
import { CreateBidDto } from '../bids/dto/create-bid.dto';
import { isNumber } from 'util';

@Injectable()
export class BidEditValidation implements PipeTransform<any, any> {
  transform(value: CreateBidDto, metadata: ArgumentMetadata): CreateBidDto {

    const { proposedPrice } = value;

    if (!isNumber(proposedPrice)) {
      throw new BadRequestException('...');
    }

    return value;
  }
}
