import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentification.service';
import { LanguageService } from '../language.service';
import {NavigationEnd, Router} from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css', '../app.component.css']
})
export class NavbarComponent {

  treeHighlighted: "highlighted" | "";
  cardHighlighted: "highlighted" | "";
  constructor(
    public readonly authService: AuthenticationService,
    private readonly langService: LanguageService,
    private router: Router
  ) {
    const treetestUrls = ['/create-tree-test', '/tests'];
    const treetestPartialUrls = ['/create-tree-test/', '/treetest/', '/results/', '/pie-tree/'];
    router.events.subscribe((val) => {
      if (!(val instanceof NavigationEnd)) return;
      const partialMatch = treetestPartialUrls.find(url => val.urlAfterRedirects.startsWith(url));
      this.treeHighlighted = treetestUrls.includes(val.urlAfterRedirects) || partialMatch ? "highlighted" : ""
      this.cardHighlighted = this.treeHighlighted || val.urlAfterRedirects === "/admin" ? "" : "highlighted";
    });
  }

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
