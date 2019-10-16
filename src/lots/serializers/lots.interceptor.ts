import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigService } from '../../shared/config.service';
import { PaginationResultInterface } from '../../shared/pagination';
import { Lot } from '../../entities/lot';

export interface LotsResponse {
  resources: Lot[];
  meta: {
    page: number;
    perPage: number;
    total: number;
  };
}

@Injectable()
export class LotsSerializerInterceptor<T extends PaginationResultInterface<Lot>> implements NestInterceptor<T, LotsResponse> {
  constructor(
    private configService: ConfigService,
  ) {}
  intercept( context: ExecutionContext, next: CallHandler<T>): Observable<LotsResponse> {
    const { query } = context.switchToHttp().getRequest();

    return next.handle().pipe(map(({ data, total }: PaginationResultInterface<Lot>) => ({
      resources: data,
      meta: {
          page: query.page || this.configService.config.pagination.page,
          perPage: this.configService.config.pagination.perPage,
          total,
        },
      }),
      ),
    );
  }
}
