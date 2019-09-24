import { CallHandler, ExecutionContext, Injectable, NestInterceptor} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface LoginResponse {
  meta: {};
  resource: {
    id: number,
    firstName: string,
    email: string,
    token: string,
  };
}

@Injectable()
export class LoginSerializerInterceptor implements NestInterceptor {
  intercept( context: ExecutionContext, next: CallHandler): Observable<LoginResponse> {
    return next.handle().pipe(
      map(({ user, jwtToken }) => {
        return {
          resource: {
            id: user.id,
            firstName: user.firstName,
            email: user.email,
            token: jwtToken,
          },
          meta: {},
        };
      }),
    );
  }
}
