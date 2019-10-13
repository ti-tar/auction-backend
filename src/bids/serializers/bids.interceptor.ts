import {
  CallHandler, ExecutionContext, Injectable, NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface BidsResponse<B, C> {
  resources: B;
  meta: { total: C };
}

@Injectable()
export class BidsSerializerInterceptor<B, C> implements NestInterceptor<[B, C], BidsResponse<B, C>> {
  intercept( context: ExecutionContext, next: CallHandler<[B, C]>): Observable<BidsResponse<B, C>> {
    return next.handle().pipe(map(([bids, count]) => ({
        resources: bids,
        meta: { total: count },
      }),
      ),
    );
  }
}
