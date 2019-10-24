import { IsString, IsNotEmpty } from 'class-validator';

import { Status, TypeStatus } from '../../entities/order';

export class OrderDto {
  @IsString()
  @IsNotEmpty()
  readonly arrivalLocation: string;

  @IsString()
  @IsNotEmpty()
  readonly type: TypeStatus;

  @IsString()
  @IsNotEmpty()
  readonly status: Status;
}
