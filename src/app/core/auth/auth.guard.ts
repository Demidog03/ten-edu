import { inject } from '@angular/core';
import { AuthStore } from './auth.store';
import { AuthApi } from '../../features/auth/auth.api';
import {CanMatchFn, Router} from '@angular/router';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanMatchFn = () => {
  const auth = inject(AuthApi);
  const store = inject(AuthStore);
  const router = inject(Router);

  if (!store.isLoggedIn()) {
    return router.createUrlTree(['/auth']);
  }

  if (!store.user()) {
    return auth.profile().pipe(
      map(profile => {
        store.setUser(profile);
        return true;
      }),
      catchError(() => of(router.createUrlTree(['/auth'])))
    );
  }

  return true;
};
