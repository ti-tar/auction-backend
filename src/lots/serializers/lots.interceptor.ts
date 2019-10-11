import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigService } from '../../shared/config.service';

export interface LotsResponse<T> {
  resources?: T;
}

@Injectable()
export class LotsSerializerInterceptor<T> implements NestInterceptor<T, LotsResponse<T>> {
  constructor(
    private configService: ConfigService,
  ) {}
  intercept( context: ExecutionContext, next: CallHandler<T>): Observable<LotsResponse<T>> {
    const { query } = context.switchToHttp().getRequest();
    // todo
    // @ts-ignore
    return next.handle().pipe(map(({ data, total }) => ({
      resources: data,
      meta: {
          page: query.page || this.configService.pagination.page,
          perPage: this.configService.pagination.perPage,
          total,
        },
      }),
      ),
    );
  }
}
