import { CallHandler, ExecutionContext, Injectable, NestInterceptor} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Order } from '../../entities/order';
import { Bid } from '../../entities/bid';

export interface OrderResponse<T> {
  id: number;
  arrivalLocation: string;
  type: string;
  status: string;
  bid: Bid;
}

@Injectable()
export class OrderSerializerInterceptor<T extends Order> implements NestInterceptor<T, OrderResponse<T>> {
  intercept( context: ExecutionContext, next: CallHandler<T>): Observable<OrderResponse<T>> {
    return next.handle().pipe(
      map(order => {
        return {
          id: order.id,
          arrivalLocation: order.arrivalLocation,
          type: order.type,
          status: order.status,
          bid: order.bid,
          };
        },
      ),
    );
  }
}
