import { CallHandler, ExecutionContext, Injectable, NestInterceptor} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface LotsResponse<T> {
  resource?: T;
}

@Injectable()
export class LotSerializerInterceptor<T> implements NestInterceptor<T, LotsResponse<T>> {
  intercept( context: ExecutionContext, next: CallHandler<T>): Observable<LotsResponse<T>> {
    return next.handle().pipe(
      map(total => {
        return {
            resource: total,
            meta: {},
          };
        },
      ),
    );
  }
}
