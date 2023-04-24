import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver'
import { AuthenticationService, ILoginResponse } from '../../authentification.service';
import { CardSortStudyService, ICardSortStudy, ICardSortStudyEdit } from '../card-sort-study.service';
import { CardSortTestService, ICardSortTest } from '../card-sort-test.service';
import { IParticipant } from 'src/app/treetest-components/treetest-study.service';
import * as bytes from 'bytes';

declare var $: any;

declare const MAX_REQUEST_PAYLOAD_SIZE: string;

@Component({
  selector: 'app-tests',
  templateUrl: './cardsort-studies.component.html',
  styleUrls: ['./cardsort-studies.component.css', '../../app.component.css']
})
export class CardsortStudiesComponent implements OnInit {

  public cardSortStudies: Array<ICardSortStudy>;

  public deleteCardSortTestId: string;

  private baseurl: string = '';

  private tests: Array<any> = [];

  public numberParticipants: Array<IParticipant> = [];

  private currentUser: ILoginResponse;

  public maxRequestPayloadSize = MAX_REQUEST_PAYLOAD_SIZE;

  constructor(
    private cardSortStudyService: CardSortStudyService,
    private cardSortTestSerice: CardSortTestService,
    public authService: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    $('[data-toggle="tooltip"]').tooltip();
    this.baseurl = location.origin;
    this.currentUser = this.authService.getCurrentUser();
    this.getAllCardSortTests();
  }

  getAllCardSortTests() {
    this.cardSortStudyService
      .getAllByUserId(this.currentUser?.email)
      .subscribe(res => {
        this.cardSortStudies = res;
        this.setNumberOfParticipants();
      });
  }

  copyToClipboard(studyId) {

    $('#copyboardtest').append('<textarea id="copyboard"></textarea>');
    $('#copyboard').val(this.baseurl + "/#/cardsort/" + studyId);

    const input = document.getElementById('copyboard');
    const isiOSDevice = navigator.userAgent.match(/ipad|iphone/i);

    if (isiOSDevice) {

      const editable = input.contentEditable;
      const readOnly = (<any>input).readOnly;

      (<any>input).contentEditable = true;
      (<any>input).readOnly = false;

      const range = document.createRange();
      range.selectNodeContents(input);

      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);

      (<any>input).setSelectionRange(0, 999999);
      input.contentEditable = editable;
      (<any>input).readOnly = readOnly;

    } else {
      (<any>input).select();
    }
    document.execCommand('copy');
    $('#copyboard').remove();

  }

  getLink(id: string): string {
    return `${this.baseurl}/#/cardsort/${id}`;
  }

  launchStudyPreview(studyId: string): void {
    this.router.navigate(['cardsort-preview/' + studyId]);
  }

  launchCardSortTest(studyId: string, preview?: boolean): void {

    const data: ICardSortStudyEdit = {
      id: studyId,
      launched: true,
      lastLaunched: new Date()
    };

    this.cardSortStudyService
      .update(data)
      .subscribe(res => {
        if (preview) {
          this.router.navigate(['cardsort/' + studyId]);
        } else {
          this.getAllCardSortTests();
        }
      }, err => {
        alert('An error occured. Please try again later.');
      });
  }

  stopCardSortTest(studyId: string): void {

    const data: ICardSortStudyEdit = {
      id: studyId,
      launched: false,
      lastEnded: new Date()
    };

    this.cardSortStudyService
      .update(data)
      .subscribe(
        res => this.getAllCardSortTests(),
        err => alert('An error occured. Please try again later.')
      );
  }

  prepareDeleteStudy(): void {
    this.cardSortStudyService
      .delete(this.deleteCardSortTestId)
      .subscribe(
        res => this.getAllCardSortTests(),
        err => alert('An error occured. Please try again later.')
      )
      .add(() => $("#myModal").modal('hide'));
  }

  createCopy(study: ICardSortStudy) {

    let variant: ICardSortStudy = { ...study };
    delete variant._id;
    variant.lastEnded = new Date();
    variant.lastLaunched = new Date();
    variant.id = this.generateRandomStudyId();

    this.cardSortStudyService
      .add(variant)
      .subscribe(
        res => {
          this.getAllCardSortTests();
        },
        err => {
          alert("Error: " + err);
          console.log(err);
        }
      );
  }

  // Export Study
  export(studyId: string): void {
    let study = this.cardSortStudies.find(study => study._id === studyId);
    let id = study.id;
    let file;
    this.cardSortTestSerice
      .getById(id)
      .subscribe(res => {
        this.tests = res.result;
        for (let i = 0; i < this.tests.length; i++) {
          this.tests[i]["exclude"] = false;
        }
        file = {...study, tests: this.tests};
        this.downloadFile(file, id);
      });
  }

  private downloadFile(data, fileName: string): void {
    const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
    saveAs(blob, `study-${fileName}.json`);
  }

  setNumberOfParticipants() {

    // FIXME: this should be done on the backend when fetching data from db
    this.numberParticipants = [];

    for(let study of this.cardSortStudies) {
      let id = study["id"];
      this.cardSortTestSerice
        .getById(id)
        .subscribe(res => {
          this.numberParticipants.push({ id, participants: res.result.length });
        });
    }
  }

  generateRandomStudyId() {
    return Math.random().toString(36).substring(2, 15);
  }

  // Import Study
  onFileSelect(input) {

    const files = input.files;

    // var content = this.csvContent;
    if (files && files.length) {

      const fileToRead = files[0];
      let extension = fileToRead.name.split(".");
      if (extension[extension.length -1] !== "json") {
        alert("File extension is wrong! Please provide .json file.");
        return;
      }

      const maxFileSize = bytes(MAX_REQUEST_PAYLOAD_SIZE);

      if (fileToRead.size >= maxFileSize) {
        alert(`Filesize ${bytes(fileToRead.size)} exceeds limit of ${bytes(maxFileSize)}!`);
        return;
      }

      const fileReader = new FileReader();
      let json = null;
      fileReader.onload = (e) => {

        json = JSON.parse(e.target.result.toString());
        const randomStudyId = this.generateRandomStudyId();
        const study: ICardSortStudy = {
          cards: json["cards"],
          name: json["name"],
          launched: false,
          password: json["password"],
          id: randomStudyId,
          instructions: json["instructions"],
          user: this.currentUser?.email,
          welcomeMessage: json["welcomeMessage"],
          thankYouScreen: json["thankYouScreen"],
          leaveFeedback: json["leaveFeedback"],
          explanation: json["explanation"],
          subCategories: json["subCategories"],
          lastEnded: new Date(),
          lastLaunched: new Date()
        };

        this.cardSortStudyService
          .add(study)
          .subscribe(
            res => $("#success").modal('show'),
            err => alert("Error: " + err)
          );

        let testsToImport: Array<ICardSortTest> = [];

        for(let study of json["tests"]) {
          let exclude = false;
          if (study["excluded"] !== undefined) { exclude = study["excluded"]};

          const temp: ICardSortTest = {
            id: randomStudyId,
            results: study["results"],
            finished: study["finished"],
            username: study["username"],
            timestamp: study["timestamp"],
            feedback: study["feedback"],
            mindset: study["mindset"],
            excluded: exclude,
          };

          testsToImport.push(temp);
        }
        this.cardSortTestSerice
          .addMultiple(testsToImport)
          .subscribe(res => this.getAllCardSortTests());
      };

      fileReader.readAsText(input.files[0]);
    }
  }
}
