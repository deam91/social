import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, retryWhen, delay, take } from 'rxjs/operators';

@Injectable()
export class RetryInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      retryWhen((errors) =>
        errors.pipe(
          delay(1000), // delay between retries
          take(3), // maximum number of retries
          catchError((err) => {
            return throwError(err);
          }), // throw error if maximum retries exceeded
        ),
      ),
    );
  }
}
