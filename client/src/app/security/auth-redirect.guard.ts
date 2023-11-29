import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../api/authentification.service';

export const authRedirectGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthenticationService);
  const router = inject(Router);

  // Prevent a logged in user from accessing the login screen
  if (authService.isLoggedIn()) {
    // routingService.goToStart();
    router.navigate(['tree-testing']);
    return false;
  }

  return true;
};
