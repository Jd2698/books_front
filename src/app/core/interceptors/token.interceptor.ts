import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../auth.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const _authService = inject(AuthService)
  const token = _authService.getToken()

  if (!token) return next(req)

  const newRequest = req.clone({
    headers: req.headers.append('Authorization', `Bearer ${_authService.getToken()}`)
  })

  return next(newRequest)
};
