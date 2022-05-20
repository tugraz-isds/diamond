import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
declare var $: any;

@Injectable()
export class TranslationService {
  constructor(public translate: TranslateService) {
    let lang = localStorage.getItem('tt-language');
    if (lang) {
      translate.setDefaultLang(lang);
      this.translate.use(lang);
      setTimeout(() => { 
        $('.lang-' + lang).click();
       }, 100);
    } else {
      translate.setDefaultLang('en');
      this.translate.use('en');
      localStorage.setItem('tt-language', 'en');
    }
  }

  changeLanguage(lang, event) {
    const target = event.target || event.srcElement || event.currentTarget;
    $('.lang-en, .lang-de').css('opacity', 0.5);
    if (lang === "en") {
        $('.lang-en').css('opacity', 1);
    } else {
        $('.lang-de').css('opacity', 1);
    }
    $(target).css('opacity', 1);
    this.translate.use(lang);
    localStorage.setItem('tt-language', lang);
  }

}
