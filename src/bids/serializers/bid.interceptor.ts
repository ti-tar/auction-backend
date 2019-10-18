import {
  CallHandler, ExecutionContext, Injectable, NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Bid } from '../../entities/bid';

export interface BidResponse<B> {
  resource: {
    id: number;
    bidCreationTime: Date;
  };
}

@Injectable()
export class BidSerializerInterceptor<B extends Bid> implements NestInterceptor<B, BidResponse<B>> {
  intercept( context: ExecutionContext, next: CallHandler<B>): Observable<BidResponse<B>> {
    return next.handle().pipe(map(bid => ({
        resource: {
          id: bid.id,
          bidCreationTime: bid.bidCreationTime,
        },
    })));
  }
}
