import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay, retry, delayWhen } from 'rxjs/operators';

@Injectable()
export class RetryInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      retry(3), // maximum number of retries
      delayWhen(() => of(true).pipe(delay(1000))), // delay between retries
      catchError((err) => throwError(err)), // throw error if maximum retries exceeded
    );
  }
}
