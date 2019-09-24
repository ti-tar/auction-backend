import { CallHandler, ExecutionContext, Injectable, NestInterceptor} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface LotsResponse<T> {
  resources?: T;
  resource?: T;
}

@Injectable()
export class LotsSerializerInterceptor<T> implements NestInterceptor<T, LotsResponse<T>> {
  intercept( context: ExecutionContext, next: CallHandler<T>): Observable<LotsResponse<T>> {
    return next.handle().pipe(
      map(items => {
        if (Array.isArray(items)) {
          return {
            resources: items,
            meta: {},
          };
        }
        return {
            resource: items,
            meta: {},
          };
        },
      ),
    );
  }
}
