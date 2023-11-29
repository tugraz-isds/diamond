import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../api/authentification.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthenticationService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    authService.logout();
    // routingService.goToLogin();
    router.navigate(['/login']);
    return false;
  }

  return true;
};
