import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from './authentification.service';
import { Router } from '@angular/router';

import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService,
    private router: Router,
    private userService: UserService
    ) {}

  ngOnInit() {
    if (localStorage.getItem('currentUser')) {
      this.authService.loggedIn = true;
      const user = JSON.parse(localStorage.getItem('currentUser'));
      this.authService.user = user;
      this.authService.studyAccess = user.study;
    } else {
      this.authService.loggedIn = false;
      if (!((window.location.href).includes('/test/') || (window.location.href).includes('/card-sort-test/'))) {
        this.router.navigate(['/login']);
      }
    }
  }

  getRequest() {
    // return this.http.get('http://localhost:48792/');
    return this.http.get('/' + this.userService.serverUrl);
}
}
