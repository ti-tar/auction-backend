import { CallHandler, ExecutionContext, Injectable, NestInterceptor} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface SignUpResponse {
  meta: {};
  resource: {
    id: number,
    firstName: string,
    email: string,
  };
}

@Injectable()
export class SignUpSerializerInterceptor implements NestInterceptor {
  intercept( context: ExecutionContext, next: CallHandler): Observable<SignUpResponse> {
    return next.handle().pipe(
      map( user => {
        return {
          resource: {
            id: user.id,
            firstName: user.firstName,
            email: user.email,
          },
          meta: {},
        };
      }),
    );
  }
}
