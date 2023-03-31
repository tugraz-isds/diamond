import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { CardSortTestService, ICardSortTest, IResultGroup } from '../card-sort-test.service';
import { CardSortStudyService, ICardSortStudy } from '../card-sort-study.service';

declare var $: any;

@Component({
  selector: 'app-card-sort-test',
  templateUrl: './cardsort-study.component.html',
  styleUrls: ['./cardsort-study.component.css', '../../app.component.css']
})
export class CardsortStudyComponent implements OnDestroy, OnInit {
  public enterPassword = '';
  public study: ICardSortStudy;
  public password = true;
  public mindsetDone = false;
  public finished = false;
  private id = this.route.snapshot.params['id'];
  public intro = true;
  public userName = '';
  public feedback = '';
  public mindset = '';
  public feedbackDone = false;
  public ungrouped_cards: string[] = [];

  public isPreview = false;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cardSortTestService: CardSortTestService,
    private cardSortStudyService: CardSortStudyService
  ) {
    this.isPreview = this.route.snapshot.url[0].path.indexOf('preview') > - 1;
  }

  ngOnDestroy(): void {

    if (this.isPreview) {
      return;
    }

    if (!this.finished) {
      //add results in database
      const test: ICardSortTest = {
        id: this.id,
        results: null,
        finished: false,
        username: this.userName,
        timestamp: (new Date()).toISOString().slice(0, 19).replace(/-/g, "-").replace("T", " "),
        feedback: "",
        mindset: ""
      };

      this.cardSortTestService
        .add(test)
        .subscribe(
          res => console.log(res),
          err => console.log(err)
        );
    }
  }

  ngOnInit(): void {
    // $('[data-toggle="tooltip"]').tooltip();
    this.cardSortStudyService
      .passwordRequired(this.id)
      .subscribe(
        res => {
          if (res === 'redirect' && !this.isPreview) {
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
          this.password = false;
          this.router.navigate(['study-closed']);
        }
      );
  }

  onFinishSorting(results: Array<IResultGroup>): void {

    if (this.isPreview) {
      return;
    }

    this.finished = true;

    const test: ICardSortTest = {
      id: this.id,
      results: results,
      finished: true,
      username: this.userName,
      timestamp: (new Date()).toISOString().slice(0, 19).replace(/-/g, "-").replace("T", " "),
      feedback: '',
      mindset: ''
    };

    this.cardSortTestService
      .add(test)
      .subscribe(
        res => console.log(res),
        err => console.log(err)
      );
  }

  sendMindset(): void {
    if (this.isPreview) {
      return;
    }

    this.cardSortTestService
      .mindset(this.userName, this.mindset)
      .subscribe()
      .add(() => this.mindsetDone = true);
  }

  sendFeedback(): void {

    if (this.isPreview) {
      return;
    }

    this.cardSortTestService
      .feedback(this.userName, this.feedback)
      .subscribe()
      .add(() => this.mindsetDone = true);
  }

  preparePassword(): void {
    this.cardSortStudyService
      .checkPassword(this.id, this.enterPassword)
      .subscribe(
        res => {
          if (!res) {
            alert('Wrong password!');
          } else {
            this.study = res as ICardSortStudy;
            this.ungrouped_cards = this.study.cards;
          }
        },
        err => alert('Wrong password!')
      );
  }
}
