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
  templateUrl: './cardsort-studies.component.html',
  styleUrls: ['./cardsort-studies.component.css', '../../app.component.css']
})
export class CardsortStudiesComponent implements OnInit {
  cardSortStudies;
  deleteCardSortTestId;
  baseurl = "";
  tests = [];
  numberParticipants = [];

  constructor(private http: HttpClient, private userService: UserService, public authService: AuthenticationService, private router: Router) { }

  ngOnInit() {
    $('[data-toggle="tooltip"]').tooltip();
    this.baseurl = location.origin;
    this.getAllCardSortTests();
  }

  getAllCardSortTests() {
    const data = {
        user: JSON.parse(localStorage.getItem('currentUser')).email
    };
    this.getCardSortTestData(data)
    .subscribe(
      res => {
        this.cardSortStudies = res;
        this.setNumberOfParticipants();
      },
      err => {
      }
    );
  }

  copyToClipboard(studyId) {

    $('#copyboardtest').append('<textarea id="copyboard"></textarea>');
    $('#copyboard').val(this.baseurl + "/#/card-sort-test/" + studyId);

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

  getCardSortTestData(object) {
    //const header = new Headers({ Authorization: 'Bearer ' + (JSON.parse(localStorage.getItem('currentUser'))).token});
    const httpOptions = {
        headers: new HttpHeaders({
        'Content-Type':  'application/json',
          Authorization: 'Bearer ' + (JSON.parse(localStorage.getItem('currentUser'))).token
      })
  };
    return this.http.post(this.userService.serverUrl + '/users/card-sort-study/getbyuserid', object, httpOptions);
  }

  getLink(id) {
    return this.baseurl + "/#/card-sort-test/" + id;
  }

  launchCardSortTest(studyId, preview?) {
    const data = {
      id: studyId,
      launched: true,
      lastLaunched: new Date()
  };
    this.editCardSortTest(data)
    .subscribe(
      res => {
        this.getAllCardSortTests();
        if (preview) {
          this.router.navigate(['card-sort-test/' + studyId]);
        }
      },
      err => {
        alert('An error occured. Please try again later.');
      }
    );
  }

  stopCardSortTest(studyId) {
    const data = {
      id: studyId,
      launched: false,
      lastEnded: new Date()
    };
    this.editCardSortTest(data)
    .subscribe(
      res => {
        this.getAllCardSortTests();
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
        this.getAllCardSortTests();
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
    return this.http.post(this.userService.serverUrl + '/users/card-sort-study/delete', {id: this.deleteCardSortTestId}, httpOptions);
  }

  editCardSortTest(data) {
    const header = new Headers({ Authorization: 'Bearer ' + (JSON.parse(localStorage.getItem('currentUser'))).token});
    const httpOptions = {
        headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: 'Bearer ' + (JSON.parse(localStorage.getItem('currentUser'))).token
      })
  };
    return this.http.post(this.userService.serverUrl + '/users/card-sort-study/edit', data, httpOptions);
  }

  // Export Study
  export(studyId){
    let study = this.cardSortStudies.find(study => study._id === studyId);
    let id = study.id;
    let file;
    this.resultsInformation(id)
          .subscribe(
            res => {
              this.tests = (<any>res).result;
              for (let i = 0; i < this.tests.length; i++) {
                this.tests[i]["exclude"] = false;
              }
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
      return this.http.post(this.userService.serverUrl + '/users/card-sort-tests/' + id, '', httpOptions);
    }

    setNumberOfParticipants(){
      let obj;
      this.numberParticipants = [];
      for(let study of this.cardSortStudies){
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
  
        const fileReader = new FileReader();
        let json = null;
        fileReader.onload = (e) => {
          json = JSON.parse(e.target.result.toString());
          const randomStudyId = Math.random().toString(36).substring(2, 15);
          const study = {
            cards: json["cards"],
            name: json["name"],
            launched: false,
            password: json["password"],
            id: randomStudyId,
            instructions: json["instructions"],
            user: JSON.parse(localStorage.getItem('currentUser')).email,
            welcomeMessage: json["welcomeMessage"],
            thankYouScreen: json["thankYouScreen"],
            leaveFeedback: json["leaveFeedback"],
            explanation: json["explanation"],
            subCategories: json["subCategories"],
            lastEnded: new Date(),
            lastLaunched: new Date()
        };
        
  
        this.postCardSortStudyData(study)
        .subscribe(
          res => {
            $("#success").modal('show');
          },
          err => {
            alert("Error: " + err);
            console.log(err);
          }
        );
        for(let study of json["tests"]){
          let exclude = false;
          if (study["excluded"] !== undefined) { exclude = study["excluded"]};
          const temp = {
            id: randomStudyId,
            results: study["tests"],
            finished: study["finished"],
            username: study["username"],
            timestamp: study["timestamp"],
            feedback: study["feedback"],
            mindset: study["mindset"],
            excluded: exclude,
          };

          this.postCardSortTestData(temp)
            .subscribe(
              res => {
                console.log(res);
              },
              err => {
                console.log(err);
              }
            );
        }
        this.getAllCardSortTests();
        };
        fileReader.readAsText(input.files[0]);
        
      }
    }

    postCardSortStudyData(object) {
      const header = new Headers({ Authorization: 'Bearer ' + (JSON.parse(localStorage.getItem('currentUser'))).token});
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          Authorization: 'Bearer ' + (JSON.parse(localStorage.getItem('currentUser'))).token
        })
      };
      return this.http.post(this.userService.serverUrl + '/users/card-sort-study/add', object, httpOptions);
    }

    postCardSortTestData(object) {
      const header = new Headers({ Authorization: 'Bearer ' + (JSON.parse(localStorage.getItem('currentUser'))).token});
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          Authorization: 'Bearer ' + (JSON.parse(localStorage.getItem('currentUser'))).token
        })
      };
      return this.http.post(this.userService.serverUrl + '/users/card-sort-tests/add', object, httpOptions);
    }
}
