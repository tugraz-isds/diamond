import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentification.service';
import { TranslationService } from '../translate.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css', '../app.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(public authService: AuthenticationService, public translationService: TranslationService) { }

  ngOnInit() {
  }

  logout() {
    this.authService.logout();
    location.reload();
  }

}
