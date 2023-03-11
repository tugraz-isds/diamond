import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AppRoutingService {

  constructor(private router: Router) { }

  goToStart() {
    // TODO: start page depends on user role & current state
    this.router.navigate(['/tests']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
