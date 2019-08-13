import { IsString, IsNumber } from 'class-validator';

export class CreateLotDto {
  @IsString() 
  readonly title: string;

  @IsString() 
  readonly image?: string;
 
  @IsString() 
  readonly description?: string;

  @IsNumber()
  readonly currentPrice: number;

  @IsString()
  readonly lotStartTime: string;

  @IsString()
  readonly lotEndTime: string;
}