import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class LanguageService {

  private static CURRENT_LANG_KEY = 'dm-current-lang';

  constructor(public translate: TranslateService) {

    translate.addLangs(['en', 'de']);
    translate.setDefaultLang( 'en' );
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|de/) ? browserLang : 'en');

    const currentLang = this.loadCurrentLang();

    if (currentLang) {
      translate.use(currentLang);
    }
  }

  changeLanguage(lang: string) {
    // TODO: update lang meta tag ?
    // https://github.com/ngx-translate/core/issues/565
    this.translate.use(lang);
    this.saveCurrentLang(lang);
  }

  isCurrentLang(lang: string) {
    return this.translate.currentLang === lang;
  }

  private loadCurrentLang(): string {
    return localStorage.getItem(LanguageService.CURRENT_LANG_KEY);
  }

  private saveCurrentLang(currentLang: string): void {
    localStorage.setItem(LanguageService.CURRENT_LANG_KEY, currentLang);
  }

}
