import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router)
  
    return next(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // console.log('interceptor', error);
        if (error.status === 401) {
          console.log('unauthorized', error);
          router.navigate(['auth/login'])
        }
  
        return throwError(() => error)
      }
      )
    )
};
