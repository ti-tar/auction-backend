import { CallHandler, ExecutionContext, Injectable, NestInterceptor} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface ProfileResponse {
  id: 1;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  status: string;
}

@Injectable()
export class UserProfileSerializerInterceptor implements NestInterceptor {
  intercept( context: ExecutionContext, next: CallHandler): Observable<ProfileResponse> {
    return next.handle().pipe(
      map(user => {
        return {
          id: user.id,
          email: user.email,
          phone: user.phone,
          firstName: user.firstName,
          lastName: user.lastName,
          status: user.status,
        };
      }),
    );
  }
}
