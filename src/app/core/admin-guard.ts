import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth';

/** Só deixa entrar em /admin quem fez login como administrador. */
export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.admin()) return true;
  return router.createUrlTree([auth.logado() ? '/' : '/login']);
};
