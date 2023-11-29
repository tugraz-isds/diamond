import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/api/authentification.service';

export interface INavMenuItem {
  path: string,
  label: string
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public mainNavMenuItems: Array<INavMenuItem> = [
    { path: '/tree-testing', label: 'Tree Testing' },
    { path: '/card-sorting', label: 'Card Sorting' }
  ];

  public secondaryNavMenuItems: Array<INavMenuItem> = [
    { path: '/admin', label: 'Admin Panel' },
    { path: '/profile', label: 'My Profile' }
  ];

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.setupMainNav();
  }

  setupMainNav(): void {

  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}

