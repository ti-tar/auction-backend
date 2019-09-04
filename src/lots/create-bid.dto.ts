import { IsNumber } from 'class-validator';

export class CreateBidDto {

  @IsNumber() 
  readonly proposedPrice: number;

}