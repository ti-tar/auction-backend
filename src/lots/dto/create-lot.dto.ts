import { IsString, IsNumber, IsDateString, IsNotEmpty } from 'class-validator';

export class CreateLotDto {
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsString()
  @IsNotEmpty()
  readonly image?: string;

  @IsString()
  @IsNotEmpty()
  readonly description?: string;

  @IsNumber()
  @IsNotEmpty()
  readonly currentPrice: number;

  @IsNumber()
  @IsNotEmpty()
  readonly estimatedPrice: number;

  @IsDateString()
  @IsNotEmpty()
  readonly endTime: string;
}
