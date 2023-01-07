import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentification.service';
import { LanguageService } from '../language.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css', '../app.component.css']
})
export class NavbarComponent {

  constructor(
    public readonly authService: AuthenticationService,
    private readonly langService: LanguageService
  ) { }

  onLogout($event?: MouseEvent | KeyboardEvent) {
    $event?.preventDefault();
    this.authService.logout();
    location.reload();
  }

  changeLanguage(lang: string, $event: MouseEvent): void {
    $event.preventDefault();
    this.langService.changeLanguage(lang);
  }

  isCurrentLang(lang: string): boolean {
    return this.langService.isCurrentLang(lang);
  }

}
