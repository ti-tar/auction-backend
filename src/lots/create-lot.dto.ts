import { IsString, IsNumber, IsDateString, IsEnum } from 'class-validator';
import { Status } from '../entities/lot';

export class CreateLotDto {
  @IsString() 
  readonly title: string;

  @IsString() 
  readonly image?: string;
 
  @IsString() 
  readonly description?: string;

  // @IsEnum(Status)
  // readonly status: string;

  @IsNumber()
  readonly currentPrice: number;

  @IsNumber()
  readonly estimatedPrice: number;

  @IsDateString()
  readonly startTime: string;

  @IsDateString()
  readonly endTime: string;
}