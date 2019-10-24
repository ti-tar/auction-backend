import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Order } from '../../entities/order';

export interface OrdersResponse {
  resources: Order[];
  meta: {};
}

@Injectable()
export class OrdersSerializerInterceptor<T extends Order[]> implements NestInterceptor<T, OrdersResponse> {
  intercept( context: ExecutionContext, next: CallHandler<T>): Observable<OrdersResponse> {
    const { query } = context.switchToHttp().getRequest();

    return next.handle().pipe(map((orders: Order[]) => ({
        resources: orders,
        meta: {},
      }),
      ),
    );
  }
}
