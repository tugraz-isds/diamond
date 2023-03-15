import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AppRoutingService } from './app-routing.service';
import { AuthenticationService } from './authentification.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthenticationService,
    private routingService: AppRoutingService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (!this.authService.isLoggedIn()) {
      this.authService.logout();
      this.routingService.goToLogin();
      return false;
    }
    return this.checkPermission(route);
  }

  checkPermission(route: ActivatedRouteSnapshot) : boolean {
    return true;
    /*const currentUser = this.currentUserService.getCurrentUserDetailsSnapshot();
    if (currentUser?.userRoles && route.data?.acl) {
      const currentMainRole = this.currentUserService.getMainUserRole(currentUser);
      if (route.data.acl.includes(currentMainRole)) {
        return true;
      } else {
        // Info: Show Toast Message: Route access not allowed
        this.routingService.goToStart();
        return false;
      }
    }
    return true;*/
  }
}
