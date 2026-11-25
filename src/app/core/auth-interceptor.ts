import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth';
import { API } from './api';

/** Envia o token do usuário logado nas chamadas à API (o backend usa para liberar as rotas de admin). */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).usuario()?.token;
  if (!token || !req.url.startsWith(API)) return next(req);
  return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
};
