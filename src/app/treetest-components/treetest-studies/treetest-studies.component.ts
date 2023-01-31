import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

import { UserService } from '../../user.service';
import { AuthenticationService } from '../../authentification.service';

import { Router, ActivatedRoute } from '@angular/router';

import { saveAs } from 'file-saver'

declare var $: any;

@Component({
  selector: 'app-tests',
  templateUrl: './treetest-studies.component.html',
  styleUrls: ['./treetest-studies.component.css', '../../app.component.css']
})
export class TreetestStudiesComponent implements OnInit {
  studies;
  tests = [];
  deleteTestId;
  baseurl = "";
  showModal = false;
  //number of participants for each study
  numberParticipants = [];
  constructor(private http: HttpClient, private userService: UserService, public authService: AuthenticationService, private router: Router) { }

  ngOnInit() {
    $('[data-toggle="tooltip"]').tooltip();
    this.baseurl = location.origin;
    this.getAllTests(); 
    
  }

  getAllTests() {
    const data = {
        user: JSON.parse(localStorage.getItem('currentUser')).email
    };
    
    this.getTestData(data)
    .subscribe(
      res => {
        this.studies = res;
        this.setNumberOfParticipants();
      },
      err => {
      }
    );
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

  getTestData(object) {
    const header = new Headers({ Authorization: 'Bearer ' + (JSON.parse(localStorage.getItem('currentUser'))).token});
    const httpOptions = {
        headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: 'Bearer ' + (JSON.parse(localStorage.getItem('currentUser'))).token
      })
  };
    return this.http.post(this.userService.serverUrl + '/users/tree-study/getbyuserid', object, httpOptions);
  }

  getLink(id) {
    return this.baseurl + "/#/treetest/" + id;
  }

  launchPreview(studyId: string): void {
    this.router.navigate(['treetest-preview/' + studyId]);
  }

  launchTest(studyId, preview?) {
    const data = {
      id: studyId,
      launched: true,
      lastLaunched: new Date()
  };
    if (!preview && !confirm('Continue? Study will not be changeable after launch!')) {
      return;
    }
    this.editTest(data)
    .subscribe(
      res => {
        this.getAllTests();
        if (preview) {
          this.router.navigate(['treetest/' + studyId]);
        }
      },
      err => {
        alert('An error occured. Please try again later.');
      }
    );
  }

  stopTest(studyId) {
    let date = new Date();
    const data = {
      id: studyId,
      launched: false,
      lastEnded: new Date()
    };
    this.editTest(data)
    .subscribe(
      res => {
        this.getAllTests();
      },
      err => {
        alert('An error occured. Please try again later.');
      }
    );
  }

  prepareDeleteStudy() {
    this.deleteStudy()
    .subscribe(
      res => {
        this.getAllTests();
        $("#myModal").modal('hide');
      },
      err => {
        $("#myModal").modal('hide');
        alert('An error occured. Please try again later.');
      }
    );
  }

  deleteStudy() {
    const header = new Headers({ Authorization: 'Bearer ' + (JSON.parse(localStorage.getItem('currentUser'))).token});
    const httpOptions = {
        headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: 'Bearer ' + (JSON.parse(localStorage.getItem('currentUser'))).token
      })
  };
    return this.http.post(this.userService.serverUrl + '/users/tree-study/delete', {id: this.deleteTestId}, httpOptions);
  }

  editTest(data) {
    const header = new Headers({ Authorization: 'Bearer ' + (JSON.parse(localStorage.getItem('currentUser'))).token});
    const httpOptions = {
        headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: 'Bearer ' + (JSON.parse(localStorage.getItem('currentUser'))).token
      })
  };
  //http://localhost:48792
    return this.http.post(this.userService.serverUrl + '/users/tree-study/edit', data, httpOptions);
  }

  createCopy(study) {
    
    let variant = { ...study }
    delete variant._id;
    variant.lastEnded = new Date();
    variant.lastLaunched = new Date();
    variant.id = this.generateRandomStudyId();

    this.postStudyData(variant)
      .subscribe(
        res => {
          this.getAllTests();
        },
        err => {
          alert("Error: " + err);
          console.log(err);
        }
      );
  }

  export(studyId){
  let study = this.studies.find(study => study._id === studyId);
  let id = study.id;
  let file;
  this.resultsInformation(id)
        .subscribe(
          res => {
            this.tests = (<any>res).result;
            file = {...study, tests : this.tests};
            this.downloadFile(file, id);
            console.log(file);
          },
          err => {
            console.log(err);
          }
        );
  }

  private downloadFile(data, fileName) {
    const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
    saveAs(blob, `study-${fileName}.json`);
  }


  resultsInformation(id) {
    /*const header = new Headers({ Authorization: 'Bearer ' + (JSON.parse(localStorage.getItem('currentUser'))).token});*/
    const httpOptions = {
        headers: new HttpHeaders({
        'Content-Type':  'application/json',
         Authorization: 'Bearer ' + (JSON.parse(localStorage.getItem('currentUser'))).token
      })
  };
    return this.http.post(this.userService.serverUrl + '/users/tree-tests/' + id, "", httpOptions);
  }

  setNumberOfParticipants(){
    let obj;
    this.numberParticipants = [];
    for(let study of this.studies){
      let number = 0;
      let id = study["id"];
      this.resultsInformation(id)
        .subscribe(
          res => {
            let tests = (<any>res).result;
            for (let i = 0; i < tests.length; i++) {
              number ++;
            }
            obj = {id: id, participants: number}
            this.numberParticipants.push(obj)
          },
          err => {
            console.log(err);
          }
        );
    }
  }

  generateRandomStudyId() {
    return Math.random().toString(36).substring(2, 15);
  }
  

  onFileSelect(input) {

    const files = input.files;
    

    if (files && files.length) {

      const fileToRead = files[0];
      let extension = fileToRead.name.split(".");
      if (extension[extension.length -1] !== "json") {
        alert("File extension is wrong! Please provide .json file.");
        return;
      }

      const fileReader = new FileReader();
      let json = null;

      fileReader.onload = (e) => {
        let study;
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
            user: JSON.parse(localStorage.getItem('currentUser')).email,
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

        this.postStudyData(study)
        .subscribe(
          res => {
            $("#success").modal('show');
          },
          err => {
            alert("Error: " + err);
            console.log(err);
          }
        );
        for(let test of json["tests"]){
          let exclude = false;
          if (test["excluded"] !== undefined) { exclude = test["excluded"]};
          const temp = {
            id: study.id,
            results: test["results"],
            finished: test["finished"],
            username: test["username"],
            timestamp: test["timestamp"],
            feedback: test["feedback"],
            excluded: exclude,
          };

          this.postTestData(temp)
            .subscribe(
              res => {
                console.log(res);
              },
              err => {
                console.log(err);
              }
            );
        }
        this.getAllTests();
        };
        fileReader.readAsText(input.files[0]);
      
    }
  }

  postStudyData(object) {
    const header = new Headers({ Authorization: 'Bearer ' + (JSON.parse(localStorage.getItem('currentUser'))).token});
    const httpOptions = {
        headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: 'Bearer ' + (JSON.parse(localStorage.getItem('currentUser'))).token
      })
    };
    return this.http.post(this.userService.serverUrl + '/users/tree-study/add', object, httpOptions);
  }

  postTestData(object) {
    const header = new Headers({ Authorization: 'Bearer ' + (JSON.parse(localStorage.getItem('currentUser'))).token});
    const httpOptions = {
        headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: 'Bearer ' + (JSON.parse(localStorage.getItem('currentUser'))).token
      })
    };
    return this.http.post(this.userService.serverUrl + '/users/tree-tests/add', object, httpOptions);
  }

  

}

