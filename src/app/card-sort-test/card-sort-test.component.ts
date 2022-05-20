import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

import { UserService } from '../user.service';

declare var $: any;

@Component({
  selector: 'app-card-sort-test',
  templateUrl: './card-sort-test.component.html',
  styleUrls: ['./card-sort-test.component.css', '../app.component.css']
})
export class CardSortTestComponent implements OnDestroy, OnInit {
  startTime;
  endTime;
  enterPassword = '';
  study;
  password = true;
  mindsetDone = false;
  finished = false;
  id = this.route.snapshot.params['id'];
  intro = true;
  userName = "";
  feedback = "";
  mindset = "";
  feedbackDone = false;
  ungrouped_cards: string[] = [];


  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router, private userService: UserService) {
    var date = (new Date()).toISOString().slice(0, 19).replace(/-/g, "-").replace("T", " ");
  }


  getCardSortTestData() {
    /*const header = new Headers({ Authorization: 'Bearer ' + (JSON.parse(localStorage.getItem('currentUser'))).token});*/
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
    };
    //return this.http.post('http://localhost:48792/users/results/' +
    return this.http.post(this.userService.serverUrl +  '/users/results/' + this.id, "", httpOptions);
  }


  ngOnDestroy() {
    if (!this.finished) {
      //add results in database
      const result = {
        id: this.id,
        results: null,
        finished: false,
        username: this.userName,
        timestamp: (new Date()).toISOString().slice(0, 19).replace(/-/g, "-").replace("T", " "),
        feedback: "",
        mindset: ""
      };

      this.postCardSortTestData(result)
          .subscribe(
              res => {
                console.log(res);
              },
              err => {
                console.log(err);
              }
          );
    }
  }


  ngOnInit() {
    $('[data-toggle="tooltip"]').tooltip();
    this.getCardSortTestData()
        .subscribe(
            res => {
              console.log(res);
            },
            err => {
              console.log(err);
            }
        );
  
    const body = {
      id: this.id
    };
    this.passwordRequired(body)
        .subscribe(
            res => {
              console.log('RES');
              console.log(res);

              if (res === 'redirect') {
                console.log('redirect');
                this.router.navigate(['tests']);
              } else {
                console.log('NO REDIRECT');
              }
              if (res) {
                this.password = true;
              } else {
                this.password = false;
                this.preparePassword();
              }
            },
            err => {
              console.log('ERR');
              console.log(err);
              this.password = false;
            }
        );
  }

  finishSorting(results) {
    this.finished = true;

    const result = {
      id: this.id,
      results: results,
      finished: true,
      username: this.userName,
      timestamp: (new Date()).toISOString().slice(0, 19).replace(/-/g, "-").replace("T", " "),
      feedback: "",
      mindset: ""
    };

    this.postCardSortTestData(result)
        .subscribe(
            res => {
              console.log(res);
            },
            err => {
              console.log(err);
            }
        );
  }

  postMindset(object){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.http.post(this.userService.serverUrl + '/users/card-sort-results/mindset', object, httpOptions);
  }

  sendMindset(){
    const result = {
      username: this.userName,
      mindset: this.mindset
    };

    this.postMindset(result)
        .subscribe(
            res => {
              console.log(res);
              this.mindsetDone = true;
            },
            err => {
              this.mindsetDone = true;
              console.log(err);
            }
        );
  }


  sendFeedback() {
    const result = {
      username: this.userName,
      feedback: this.feedback
    };

    this.postFeedback(result)
        .subscribe(
            res => {
              console.log(res);
              this.feedbackDone = true;
            },
            err => {
              this.feedbackDone = true;
              console.log(err);
            }
        );
  }


  passwordRequired(id) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE'
      })
    };
    return this.http.post(this.userService.serverUrl + '/users/card-sort-test/passwordrequired', id, httpOptions);
  }

  preparePassword() {
    const body = {
      id: this.id,
      password: this.enterPassword
    };
    this.sendPassword(body)
        .subscribe(
            res => {
              console.log(res);
              if (!res) {
                alert('Wrong password!');
              } else {
                this.study = res;
                this.ungrouped_cards = this.study.cards;
              }
            },
            err => {
              console.log('ERR');
              console.log(err);
              alert('Wrong password!');
            }
        );
  }

  sendPassword(body) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE'
      })
    };
    return this.http.post(this.userService.serverUrl + '/users/card-sort-test/password', body, httpOptions);
  }

  postCardSortTestData(object) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.http.post(this.userService.serverUrl + '/users/card-sort-results/add', object, httpOptions);
  }


  postFeedback(object) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.http.post(this.userService.serverUrl + '/users/card-sort-results/feedback', object, httpOptions);
  }
}
