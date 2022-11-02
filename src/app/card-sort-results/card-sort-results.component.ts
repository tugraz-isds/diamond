import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

import { UserService } from '../user.service';

declare var $: any;

@Component({
  selector: 'app-card-sort-results',
  templateUrl: './card-sort-results.component.html',
  styleUrls: ['./card-sort-results.component.css', '../app.component.css']
})
export class CardSortResultsComponent implements OnInit {

  // tslint:disable-next-line:no-string-literal
  id = this.route.snapshot.params['id'];
  results = [];
  test;
  numberCompleted = 0;
  numberLeft = 0;

  totalParticipants = 0;
  numberIncludedParticipants =0;

  showingMatrix = false;

  root;
  duration = 750;
  i = 0;
  deleteParticipantResultIndex;

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router, private userService: UserService) { }

  ngOnInit() {
    $('[data-toggle="tooltip"]').tooltip();
    if (this.id) {
      this.resultsInformation()
        .subscribe(
          res => {
            this.results = (res as any).result;
            this.test = (res as any).card_sort_test;
            this.prepareResults();
          },
          err => {
            console.log(err);
          }
        );
    } else {
      this.router.navigate(['card-sort-tests']);
    }
  }

  updateResultParticipants(index) {
    setTimeout(() => {
      this.prepareResults();
    }, 300);
  }

  showResultMatrix(result){
    this.showingMatrix = true;
    for (const r of this.results){
      r.showing = false;
    }
    result.showing = true;
  }

  resultsInformation() {
    /*const header = new Headers({ Authorization: 'Bearer ' + (JSON.parse(localStorage.getItem('currentUser'))).token});*/
    const httpOptions = {
        headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
  };
  // return this.http.post('http://localhost:48792/users/results/' +
    return this.http.post(this.userService.serverUrl + '/users/card-sort-test/' + this.id, '', httpOptions);
  }

  getIncludeResultNumber() {
    let inc = 0;
    for (let i = 0; i < this.results.length; i++) {
      if (!this.results[i].excluded) { inc++; }
    }
    return inc;
  }

  prepareResults() {
    this.numberCompleted = 0;
    this.numberLeft = 0;

    this.numberIncludedParticipants = 0;
    this.totalParticipants = 0;

    for (let i = 0; i < this.results.length; i++) {
      this.totalParticipants ++;
      if (!this.results[i].excluded) {
        this.numberIncludedParticipants++;
        if (this.results[i].finished) { this.numberCompleted++; }
        else { this.numberLeft++; }
      }
    }
  }


  getDuration(results) {
    if (!results.finished) {
      return 'Abandoned';
    }
    let totalSeconds = 0;
    const totalMinutes = 0;
    const totalHours = 0;
    for (let i = 0; i < results.results.length; i++) {
      totalSeconds += results.results[i].time;
    }
    return Math.floor(totalSeconds);
  }


  closeResultMatrix(){
    this.showingMatrix = false;
    for (const r of this.results){
      r.showing = false;
    }
  }


  exportSortingData() {
    const rows = [];
    const cards = [];
    const map = new Map();
    let cardIndex = 0;
    for (let i = 0; i < this.results.length; i++) {
      if (this.results[i].finished) {
        for (const group of this.results[i].results) {
          for (const cardName of group.group_list) {
            const card_string = cardName.replace(/\r?\n|\r/g, '');

            cards.push(card_string);
            map.set(card_string, cardIndex);
            cardIndex++;
          }
        }
        break;
      }
    }
    rows.push(cards);
    for (let i = 0; i < this.results.length; i++) {
      if (!this.results[i].excluded) {
        const item = new Array<string>(cards.length);
        for (const group of this.results[i].results){
          for (const cardName of group.group_list) {
            const card_string = cardName.replace(/\r?\n|\r/g, '');
            const j = map.get(card_string);
            item[j] = group.group_name;
          }
        }
        rows.push(item);
      }
    }

    const csvContent = 'data:text/csv;charset=utf-8,'
        + rows.map(e => e.join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'sorts-as-rows.csv');
    document.body.appendChild(link); // Required for FF

    link.click(); // This will download the data file
  }

  exportSortingDataTransposed(){
    let rows = [];
    const cards = [];
    const map = new Map();
    let cardIndex = 0;
    for (let i = 0; i < this.results.length; i++) {
      if (this.results[i].finished) {
        for (const group of this.results[i].results) {
          for (const cardName of group.group_list) {
            const card_string = cardName.replace(/\r?\n|\r/g, '');

            cards.push(card_string);
            map.set(card_string, cardIndex);
            cardIndex++;
          }
        }
        break;
      }
    }
    rows.push(cards);
    for (let i = 0; i < this.results.length; i++) {
      if (!this.results[i].excluded) {
        const item = new Array<string>(cards.length);
        for (const group of this.results[i].results){
          for (const cardName of group.group_list) {
            const card_string = cardName.replace(/\r?\n|\r/g, '');
            const j = map.get(card_string);
            item[j] = group.group_name;
          }
        }
        rows.push(item);
      }
    }

    // transpose
    rows = rows[0].map((_, colIndex) => rows.map(row => row[colIndex]));

    const csvContent = 'data:text/csv;charset=utf-8,'
        + rows.map(e => e.join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'sorts-as-columns.csv');
    document.body.appendChild(link); // Required for FF

    link.click(); // This will download the data file
  }


  exportUserData() {
    const rows = [];
    const item = [
      'Username',
      'Timestamp',
      'Explanation',
      'Feedback'
    ];
    rows.push(item);
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.results.length; i++) {
      if (!this.results[i].excluded) {
        // tslint:disable-next-line:no-shadowed-variable
        const item = [
          this.results[i].username,
          this.results[i].timestamp,
          this.results[i].feedback.replace(/\r?\n|\r/g, ' '),
          this.results[i].mindset.replace(/\r?\n|\r/g, ' ')
        ];
        rows.push(item);
      }
    }

    const csvContent = 'data:text/csv;charset=utf-8,'
       + rows.map(e => e.join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'users-as-rows.csv');
    document.body.appendChild(link); // Required for FF

    link.click(); // This will download the data file
  }


  excludeParticpant(result, index){
    const temp = {
      _id: result["_id"],
      id: result["id"],
      results: result["results"],
      finished: result["finished"],
      username: result["username"],
      timestamp: result["timestamp"],
      feedback: result["feedback"],
      excluded: true
    };
    console.log(temp);
    this.updateParticipantsTest(temp).subscribe(
        res => {
          console.log(res);
          this.results[index].excluded = true;
          this.prepareResults();
        },
        err => {
          console.log(err);
        }
    );
  }
  includeParticipant(result, index){
    const temp = {
      _id: result["_id"],
      id: result["id"],
      results: result["results"],
      finished: result["finished"],
      username: result["username"],
      timestamp: result["timestamp"],
      feedback: result["feedback"],
      excluded: false
    };
    this.updateParticipantsTest(temp).subscribe(
        res => {
          console.log(res);
          this.results[index].excluded = false;
          this.prepareResults();
        },
        err => {
          console.log(err);
        }
    );
  }


  exportUserDataTransposed(){
    let rows = [];
    const item = [
      'Username',
      'Timestamp',
      'Explanation',
      'Feedback'
    ];
    rows.push(item);
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.results.length; i++) {
      if (!this.results[i].excluded) {
        const item = [
          this.results[i].username,
          this.results[i].timestamp,
          this.results[i].feedback.replace(/\r?\n|\r/g, ' '),
          this.results[i].mindset.replace(/\r?\n|\r/g, ' ')
        ];
        rows.push(item);
      }
    }

    // transpose
    rows = rows[0].map((_, colIndex) => rows.map(row => row[colIndex]));

    const csvContent = 'data:text/csv;charset=utf-8,'
        + rows.map(e => e.join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'users-as-columns.csv');
    document.body.appendChild(link); // Required for FF

    link.click(); // This will download the data file
  }


  prepareDeleteParticipantResult() {
    console.log('prepared!!');
    console.log(this.deleteParticipantResultIndex);
    this.deleteParticipantResult()
    .subscribe(
      res => {
        this.resultsInformation()
        .subscribe(
          res => {
            this.results = (res as any).result;
            // tslint:disable-next-line:prefer-for-of
            this.test = (res as any).test[0];
            this.prepareResults();
          },
          err => {
            console.log(err);
          }
        );
        $('#myModal10').modal('hide');
      },
      err => {
        $('#myModal10').modal('hide');
        alert('An error occured. Please try again later.');
      }
    );
  }

  deleteParticipantResult() {
    const header = new Headers({ Authorization: 'Bearer ' + (JSON.parse(localStorage.getItem('currentUser'))).token});
    const httpOptions = {
        headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: 'Bearer ' + (JSON.parse(localStorage.getItem('currentUser'))).token
      })
  };

    // tslint:disable-next-line:max-line-length
    return this.http.post(this.userService.serverUrl + '/users/card-sort-test/delete', {id: this.results[this.deleteParticipantResultIndex]._id}, httpOptions);
  }
  updateParticipantsTest(object){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: 'Bearer ' + (JSON.parse(localStorage.getItem('currentUser'))).token
      })
    };
    return this.http.post(this.userService.serverUrl + '/users/card-sort-test/edit', object, httpOptions);
  }
}
