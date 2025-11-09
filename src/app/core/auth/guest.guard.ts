import { CanMatchFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthStore } from './auth.store';

export const guestGuard: CanMatchFn = () => {
  const store = inject(AuthStore);
  const router = inject(Router);

  return store.isLoggedIn() ? router.createUrlTree(['/']) : true;
};
