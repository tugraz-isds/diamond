import { Component, OnInit } from '@angular/core';
import { AuthenticationService, ILoginResponse } from '../../authentification.service';

import { Router } from '@angular/router';

import { saveAs } from 'file-saver'
import { IParticipant, ITreetestStudy, ITreetestStudyEdit, TreetestStudyService } from '../treetest-study.service';
import { ITreetestTest, TreetestTestService } from '../treetest-test.service';
import * as bytes from 'bytes';

declare var $: any;

declare const MAX_REQUEST_PAYLOAD_SIZE: string;

@Component({
  selector: 'app-tests',
  templateUrl: './treetest-studies.component.html',
  styleUrls: ['./treetest-studies.component.css', '../../app.component.css']
})
export class TreetestStudiesComponent implements OnInit {

  private currentUser: ILoginResponse;

  public studies: Array<ITreetestStudy> = [];

  private tests = [];

  public deleteTestId: string;

  private baseurl: string;

  public maxRequestPayloadSize = MAX_REQUEST_PAYLOAD_SIZE;

  //number of participants for each study
  public numberParticipants: Array<IParticipant> = [];

  constructor(
    public authService: AuthenticationService,
    private router: Router,
    private treetestStudyService: TreetestStudyService,
    private treetestTestService: TreetestTestService
  ) { }

  ngOnInit(): void {
    $('[data-toggle="tooltip"]').tooltip();
    this.baseurl = location.origin;
    this.currentUser = this.authService.getCurrentUser();
    this.getAllTests();
  }

  getAllTests(): void {
    this.treetestStudyService
      .getAllByUserId(this.currentUser?.email)
      .subscribe(res => {
        this.studies = res;
        this.setNumberOfParticipants();
      });
  }

  copyToClipboard(studyId) {

    $('#copyboardtest').append('<textarea id="copyboard"></textarea>');
    $('#copyboard').val(this.baseurl + "/#/treetest/" + studyId);

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

  getLink(id): string {
    return this.baseurl + "/#/treetest/" + id;
  }

  launchPreview(studyId: string): void {
    this.router.navigate(['treetest-preview/' + studyId]);
  }

  launchTest(studyId: string, preview?: boolean): void {

    const data: ITreetestStudyEdit = {
      id: studyId,
      launched: true,
      lastLaunched: new Date()
    };

    if (!preview && !confirm('Continue? Study will not be changeable after launch!')) {
      return;
    }

    this.treetestStudyService
      .update(data)
      .subscribe(
        res => {
          this.getAllTests()
          if (preview) {
            this.router.navigate(['treetest/' + studyId]);
          }
        },
        err => alert('An error occured. Please try again later.')
      );
  }

  stopTest(studyId: string): void {

    const data: ITreetestStudyEdit = {
      id: studyId,
      launched: false,
      lastEnded: new Date()
    };

    this.treetestStudyService
      .update(data)
      .subscribe(
        res => this.getAllTests(),
        err => alert('An error occured. Please try again later.')
      );
  }

  prepareDeleteStudy(): void {
    this.treetestStudyService
      .delete(this.deleteTestId)
      .subscribe(
        res => this.getAllTests(),
        err => alert('An error occured. Please try again later.')
      )
      .add(() => $("#myModal").modal('hide'));
  }

  createCopy(study: ITreetestStudy): void {

    let variant = { ...study }
    delete variant._id;
    variant.lastEnded = new Date();
    variant.lastLaunched = new Date();
    variant.id = this.generateRandomStudyId();

    this.treetestStudyService
      .add(variant)
      .subscribe(
        res => this.getAllTests(),
        err => alert("Error: " + err)
      );
  }

  export(studyId: string): void {
    let study = this.studies.find(study => study._id === studyId);
    let id = study.id;
    let file;
    this.treetestTestService
      .getById(id)
      .subscribe(res => {
        this.tests = (<any>res).result;
        file = {...study, tests : this.tests};
        this.downloadFile(file, id);
      });
  }

  private downloadFile(data, fileName: string): void {
    const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
    saveAs(blob, `study-${fileName}.json`);
  }

  setNumberOfParticipants(): void {

    // FIXME: this should be done on the backend when fetching data from db
    this.numberParticipants = [];

    for(let study of this.studies){
      let id = study["id"];
      this.treetestTestService
        .getById(id)
        .subscribe(res => this.numberParticipants.push({ id, participants: res.result.length }));
    }
  }

  generateRandomStudyId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  onFileSelect(input): void {

    const files = input.files;

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
        let study: ITreetestStudy;
        try {
          json = JSON.parse(e.target.result.toString());
          const randomStudyId = this.generateRandomStudyId();
          const launchable: boolean = json["tasks"].length > 0;
          study = {
            name: json["name"],
            launched: false,
            password: json["password"],
            id: randomStudyId,
            tree: json["tree"],
            tasks: json["tasks"],
            user: this.currentUser?.email,
            welcomeMessage: json["welcomeMessage"],
            instructions: json["instructions"],
            thankYouScreen: json["thankYouScreen"],
            leaveFeedback: json["leaveFeedback"],
            leafNodes: json["leafNodes"],
            orderNumbers: json["orderNumbers"],
            lastEnded: new Date(),
            lastLaunched: new Date(),
            isLaunchable: launchable
          };
        } catch (e) {
          alert(`Error while importing!\n${e.message}`);
          return;
        }

        this.treetestStudyService
          .add(study)
          .subscribe(
            res => $("#success").modal('show'),
            err => alert("Error: " + err)
          );

        let testsToImport: Array<ITreetestTest> = [];


        for(let test of json["tests"]){
          let exclude = false;
          if (test["excluded"] !== undefined) { exclude = test["excluded"]};

          const temp: ITreetestTest = {
            id: study.id,
            results: test["results"],
            finished: test["finished"],
            username: test["username"],
            timestamp: test["timestamp"],
            feedback: test["feedback"],
            excluded: exclude,
          };

          testsToImport.push(temp);
        }

        this.treetestTestService
          .addMultiple(testsToImport)
          .subscribe(res => this.getAllTests());

      };

      fileReader.readAsText(input.files[0]);
    }
  }
}

