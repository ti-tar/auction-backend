import { IsString, IsNotEmpty } from 'class-validator';

import { OrderStatus, TypeStatus } from '../../entities/order';

export class OrderDto {
  @IsString()
  @IsNotEmpty()
  readonly arrivalLocation: string;

  @IsString()
  @IsNotEmpty()
  readonly type: TypeStatus;
}
