import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class LanguageService {

  private static CURRENT_LANG_KEY = 'dm-current-lang';

  private static DEFAUL_LANG = 'en';

  constructor(
    public translate: TranslateService,
    @Inject(DOCUMENT) private document: Document
  ) {

    translate.addLangs(['en', 'de']);
    translate.setDefaultLang( LanguageService.DEFAUL_LANG );
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|de/) ? browserLang : LanguageService.DEFAUL_LANG );

    const currentLang = this.loadCurrentLang();

    if (currentLang) {
      translate.use(currentLang);
      this.updateLanguageMeta(currentLang);
    }
  }

  changeLanguage(lang: string) {
    this.translate.use(lang);
    this.saveCurrentLang(lang);
    this.updateLanguageMeta(lang);
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

  public updateLanguageMeta(lang: string): void {
    const langAttr = document.createAttribute('lang');
    const xmlLangAttr = document.createAttribute('xml:lang');
    langAttr.value = lang;
    xmlLangAttr.value = lang;
    this.document.documentElement.attributes.setNamedItem(langAttr);
    this.document.documentElement.attributes.setNamedItem(xmlLangAttr);
  }

}
