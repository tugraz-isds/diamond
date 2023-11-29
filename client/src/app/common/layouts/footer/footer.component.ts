import { Component } from '@angular/core';
import { VERSION_INFO } from 'src/environments/version-info';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  public commitUrl: string;

  public versionInfo = VERSION_INFO;

  constructor() {
    this.commitUrl = `https://github.com/tugraz-isds/diamond/commit/${VERSION_INFO.hash}`
  }

}

