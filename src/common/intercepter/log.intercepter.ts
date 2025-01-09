import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, observable, Observable, tap } from 'rxjs';

@Injectable()
export class LogIntercepter implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    /**
     * 들어온 요청에 timestamp 찍는다.
     * [REQ] {요청path} {요청시간}
     *
     * 응답할때 다시 timestamp 찍는다.
     * [RES] {요청path} {응답시간} {걸린시간 ms}
     */
    const req = context.switchToHttp().getRequest();
    const path = req.originalUrl;
    const reqNow = new Date();
    console.log(`[REQ] ${path} ${reqNow.toLocaleString('kr')}`);

    // 실행하는 순간
    // 라우트의 로직이 전부실행되고 응답이 반환된다.
    // observable로
    return next.handle().pipe(
      tap((observable) => {
        const resNow = new Date();
        console.log(
          `[RES] ${path} ${resNow.toLocaleString('kr')} ${resNow.getMilliseconds() - reqNow.getMilliseconds()}ms`,
        );
      }),
      // map((observable) => {
      //   return {
      //     response: observable,
      //   };
      // }),
    );
  }
}
