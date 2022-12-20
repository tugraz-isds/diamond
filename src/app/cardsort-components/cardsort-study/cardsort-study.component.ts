import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

import { UserService } from '../../user.service';

declare var $: any;

@Component({
  selector: 'app-card-sort-test',
  templateUrl: './cardsort-study.component.html',
  styleUrls: ['./cardsort-study.component.css', '../../app.component.css']
})
export class CardsortStudyComponent implements OnDestroy, OnInit {
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
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
          Authorization: 'Bearer ' + (JSON.parse(localStorage.getItem('currentUser'))).token
      })
    };
    return this.http.post(this.userService.serverUrl +  '/users/card-sort-tests/' + this.id, "", httpOptions);
  }


  ngOnDestroy() {
    if (!this.finished) {
      //add results in database
      const test = {
        id: this.id,
        results: null,
        finished: false,
        username: this.userName,
        timestamp: (new Date()).toISOString().slice(0, 19).replace(/-/g, "-").replace("T", " "),
        feedback: "",
        mindset: ""
      };

      this.postCardSortTestData(test)
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
              console.log(res);

              if (res === 'redirect') {
                console.log('redirect');
                this.router.navigate(['study-closed']);
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
              console.log(err);
              this.password = false;
                this.router.navigate(['study-closed']);
            }
        );
  }

  finishSorting(results) {
    this.finished = true;

    const test = {
      id: this.id,
      results: results,
      finished: true,
      username: this.userName,
      timestamp: (new Date()).toISOString().slice(0, 19).replace(/-/g, "-").replace("T", " "),
      feedback: "",
      mindset: ""
    };

    this.postCardSortTestData(test)
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
        'Content-Type':  'application/json',
          Authorization: 'Bearer ' + (JSON.parse(localStorage.getItem('currentUser'))).token
      })
    };
    return this.http.post(this.userService.serverUrl + '/users/card-sort-tests/mindset', object, httpOptions);
  }

  sendMindset(){
    const test = {
      username: this.userName,
      mindset: this.mindset
    };

    this.postMindset(test)
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
    const test = {
      username: this.userName,
      feedback: this.feedback
    };

    this.postFeedback(test)
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
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
          Authorization: 'Bearer ' + (JSON.parse(localStorage.getItem('currentUser'))).token
      })
    };
    return this.http.post(this.userService.serverUrl + '/users/card-sort-study/passwordrequired', id, httpOptions);
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
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
          Authorization: 'Bearer ' + (JSON.parse(localStorage.getItem('currentUser'))).token
      })
    };
    return this.http.post(this.userService.serverUrl + '/users/card-sort-study/password', body, httpOptions);
  }

  postCardSortTestData(object) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
          Authorization: 'Bearer ' + (JSON.parse(localStorage.getItem('currentUser'))).token
      })
    };
    return this.http.post(this.userService.serverUrl + '/users/card-sort-tests/add', object, httpOptions);
  }


  postFeedback(object) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
          Authorization: 'Bearer ' + (JSON.parse(localStorage.getItem('currentUser'))).token
      })
    };
    return this.http.post(this.userService.serverUrl + '/users/card-sort-tests/feedback', object, httpOptions);
  }
}
