import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AppRoutingService } from 'src/app/app-routing.service';
import { AuthenticationService } from './authentification.service';


@Injectable({
  providedIn: 'root'
})
export class AuthRedirectGuard implements CanActivate {

  constructor(
    private authService: AuthenticationService,
    private routingService: AppRoutingService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // Prevent a logged in user from accessing the login screen
    if (this.authService.isLoggedIn()) {
      this.routingService.goToStart();
      return false;
    }
    return true;
  }

}
