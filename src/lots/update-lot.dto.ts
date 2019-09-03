import { IsString, IsNumber, IsDateString } from 'class-validator';

export class UpdateLotDto {
  
  @IsNumber()
  readonly id: string;

  @IsString() 
  readonly title: string;

  @IsString() 
  readonly image?: string;
 
  @IsString() 
  readonly description?: string;

  @IsNumber()
  readonly currentPrice: number;

  @IsNumber()
  readonly estimatedPrice: number;

  @IsDateString()
  readonly startTime: string;

  @IsDateString()
  readonly endTime: string;
}