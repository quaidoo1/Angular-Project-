import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  // If running on the server side, temporarily allow the route to render 
  // (the UI will hydrate and re-evaluate client-side instantly).
  if (!isBrowser) {
    return true;
  }

  if (auth.isLoggedIn) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
