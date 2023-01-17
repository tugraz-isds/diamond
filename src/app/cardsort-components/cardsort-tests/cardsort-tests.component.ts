import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Parser } from '@json2csv/plainjs';
import { CardSortTestService, ICardSortTest } from '../card-sort-test.service';
import { ICardSortStudy } from '../card-sort-study.service';

declare var $: any;


@Component({
  selector: 'app-card-sort-results',
  templateUrl: './cardsort-tests.component.html',
  styleUrls: ['./cardsort-tests.component.css', '../../app.component.css']
})
export class CardsortTestsComponent implements OnInit {

  // tslint:disable-next-line:no-string-literal
  private id: string = this.route.snapshot.params['id'];
  public tests: Array<ICardSortTest> = [];
  public study: ICardSortStudy;
  public numberCompleted = 0;
  public numberLeft = 0;

  public totalParticipants = 0;
  public numberIncludedParticipants = 0;

  public showingMatrix = false;

  // duration = 750;
  // i = 0;
  public deleteParticipantResultIndex: number;

  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private cardSortTestService: CardSortTestService
  ) { }

  ngOnInit() {
    $('[data-toggle="tooltip"]').tooltip();
    if (this.id) {
      this.cardSortTestService
        .getById(this.id)      
        .subscribe(
          res => {
            this.tests = res.result;
            this.study = res.card_sort_test[0]; 
            this.prepareResults();
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
    for (const r of this.tests){
      r.showing = false;
    }
    result.showing = true;
  }

  getIncludeResultNumber() {
    let inc = 0;
    for (let i = 0; i < this.tests.length; i++) {
      if (!this.tests[i].excluded) { inc++; }
    }
    return inc;
  }

  prepareResults() {
    this.numberCompleted = 0;
    this.numberLeft = 0;

    this.numberIncludedParticipants = 0;
    this.totalParticipants = 0;

    for (let i = 0; i < this.tests.length; i++) {
      this.totalParticipants ++;
      if (!this.tests[i].excluded) {
        this.numberIncludedParticipants++;
        if (this.tests[i].finished) { this.numberCompleted++; }
        else { this.numberLeft++; }
      }
    }
  }


  getDuration(tests) {
    if (!tests.finished) {
      return 'Abandoned';
    }
    let totalSeconds = 0;
    const totalMinutes = 0;
    const totalHours = 0;
    for (let i = 0; i < tests.results.length; i++) {
      totalSeconds += tests.results[i].time;
    }
    return Math.floor(totalSeconds);
  }


  closeResultMatrix(){
    this.showingMatrix = false;
    for (const r of this.tests){
      r.showing = false;
    }
  }


  exportSortingData() {
    const rows = [];
    const cards = [];
    const map = new Map();
    let cardIndex = 0;
    for (let i = 0; i < this.tests.length; i++) {
      if (this.tests[i].finished) {
        for (const group of this.tests[i].results) {
          for (const cardName of group.group_list) {
            const card_string = cardName;

            cards.push(card_string);
            map.set(card_string, cardIndex);
            cardIndex++;
          }
        }
        break;
      }
    }
    rows.push(cards);
    for (let i = 0; i < this.tests.length; i++) {
      if (!this.tests[i].excluded) {
        const item = new Array<string>(cards.length);
        for (const group of this.tests[i].results){
          for (const cardName of group.group_list) {
            const card_string = cardName;
            const j = map.get(card_string);
            item[j] = group.group_name;
          }
        }
        rows.push(item);
      }
    }
    const opt = {header: false};
    const json2csvParser = new Parser(opt);
    const csvContent = 'data:text/csv;charset=utf-8,' + json2csvParser.parse(rows);

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
    for (let i = 0; i < this.tests.length; i++) {
      if (this.tests[i].finished) {
        for (const group of this.tests[i].results) {
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
    for (let i = 0; i < this.tests.length; i++) {
      if (!this.tests[i].excluded) {
        const item = new Array<string>(cards.length);
        for (const group of this.tests[i].results){
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
    const opt = {header: false};
    const json2csvParser = new Parser(opt);
    const csvContent = 'data:text/csv;charset=utf-8,' + json2csvParser.parse(rows);

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'sorts-as-columns.csv');
    document.body.appendChild(link); // Required for FF

    link.click(); // This will download the data file
  }


  exportUserData() {
    const rows = [];
    // const item = [
    //   'Username',
    //   'Timestamp',
    //   'Explanation',
    //   'Feedback'
    // ];
    // rows.push(item);
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.tests.length; i++) {
      if (!this.tests[i].excluded) {
        // tslint:disable-next-line:no-shadowed-variable
        const item = {
          Name: this.tests[i].username,
          'Date and Time': this.tests[i].timestamp,
          Explanation: this.tests[i].feedback,
          Feedback: this.tests[i].mindset
        };
        rows.push(item);
      }
    }
    const json2csvParser = new Parser();
    const csvContent = 'data:text/csv;charset=utf-8,' + json2csvParser.parse(rows);

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'users-as-rows.csv');
    document.body.appendChild(link); // Required for FF

    link.click(); // This will download the data file
  }


  excludeParticpant(test: ICardSortTest, index: number): void {
    const temp: ICardSortTest = {
      _id: test["_id"],
      id: test["id"],
      results: test["results"],
      finished: test["finished"],
      username: test["username"],
      timestamp: test["timestamp"],
      feedback: test["feedback"],
      excluded: true
    };

    this.cardSortTestService
      .update(temp)
      .subscribe(
        res => {          
          this.tests[index].excluded = true;
          this.prepareResults();
        }
      );
  }

  includeParticipant(test: ICardSortTest, index: number): void {
    const temp: ICardSortTest = {
      _id: test["_id"],
      id: test["id"],
      results: test["results"],
      finished: test["finished"],
      username: test["username"],
      timestamp: test["timestamp"],
      feedback: test["feedback"],
      excluded: false
    };
    this.cardSortTestService
      .update(temp)
      .subscribe(
        res => {          
          this.tests[index].excluded = false;
          this.prepareResults();
        }
      );
  }

  exportUserDataTransposed(): void {
    let rows = [];
    const item = [
      'Name',
      'Date and Time',
      'Explanation',
      'Feedback'
    ];
    rows.push(item);
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.tests.length; i++) {
      if (!this.tests[i].excluded) {
        const item = [
          this.tests[i].username,
          this.tests[i].timestamp,
          this.tests[i].feedback,
          this.tests[i].mindset
        ];
        rows.push(item);
      }
    }

    // transpose
    rows = rows[0].map((_, colIndex) => rows.map(row => row[colIndex]));
    const opt = {header: false};
    const json2csvParser = new Parser(opt);
    const csvContent = 'data:text/csv;charset=utf-8,' + json2csvParser.parse(rows);

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'users-as-columns.csv');
    document.body.appendChild(link); // Required for FF

    link.click(); // This will download the data file
  }


  prepareDeleteParticipantResult() {
    const testToDeleteId = this.tests[this.deleteParticipantResultIndex]._id;
    this.cardSortTestService
      .delete(testToDeleteId)    
      .subscribe(
        res => {
          this.cardSortTestService
            .getById(this.id)
            .subscribe(
              res => {
                this.tests = res.result;                
                this.study = res.card_sort_test[0];
                this.prepareResults();
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
}
