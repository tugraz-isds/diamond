import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './authentification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(
    private authService: AuthenticationService,
    private router: Router
    ) {}

  ngOnInit() {
    /*if (localStorage.getItem('currentUser')) {
      this.authService.loggedIn = true;
      const user = JSON.parse(localStorage.getItem('currentUser'));
      this.authService.user = user;
      this.authService.studyAccess = user.study;
    } else {
      this.authService.loggedIn = false;
      if (!((window.location.href).includes('/test/') || (window.location.href).includes('/card-sort-test/'))) {
        this.router.navigate(['/login']);
      }
    }*/
  }

}
