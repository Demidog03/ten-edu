import {retryWhen, mergeMap, timer, throwError, tap} from 'rxjs';
import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {Metrics} from '../metrics/metrics.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const metrics = inject(Metrics);
  const started = performance.now();

  return next(req).pipe(
    tap({
      next: () => metrics.log({ url: req.url, status: 200, ms: performance.now() - started }),
      error: (e: HttpErrorResponse) =>
        metrics.log({ url: req.url, status: e.status || 0, ms: performance.now() - started }),
    }),
    retryWhen(errors =>
      errors.pipe(
        mergeMap((e: HttpErrorResponse, i) => {
          if (e.status === 0) return throwError(() => e);
          return i < 2 ? timer(200 * 2 ** i) : throwError(() => e);
        })
      )
    ),
  );
};
