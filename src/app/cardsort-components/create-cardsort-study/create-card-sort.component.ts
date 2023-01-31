import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EditComponent } from 'src/app/guard';

import { CardSortStudyService, ICardSortStudy } from '../card-sort-study.service';

declare var $: any;

@Component({
  selector: 'app-create-card-sort',
  templateUrl: './create-card-sort.component.html',
  styleUrls: ['./create-card-sort.component.css', '../../app.component.css']
})
export class CreateCardSortComponent implements OnInit, EditComponent {
  public randomTestId = Math.random().toString(36).substring(2, 15);
  public testName = '';
  public studyPassword = '';

  // tslint:disable-next-line:no-string-literal
  public id = this.route.snapshot.params['id'];

  public welcomeMessage = 'Welcome to this card sorting study!';
  public instructions = 'Please group the provided cards as you see fit.';
  public explanation = 'Please explain how you decided on the way the cards should be sorted.';
  public thankYouScreen = 'Thank you for your participation.';
  public leaveFeedback = 'Your results are saved. You can give us your feedback (optional).';

  private subCategories = true;

  public cardName = '';
  public cards: string[] = [];

  private currentlySelectedCard = '';  

  private originalTest = null;

  private csvContent: string;
  public baseurl: string = '';  

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private cardSortStudyService: CardSortStudyService
  ) { }

  ngOnInit() {
    $('[data-toggle="tooltip"]').tooltip();
    this.baseurl = location.origin;
    if (this.id) {
      this.cardSortStudyService
        .get(this.id)      
        .subscribe(
          res => {
            
            this.testName = res.name;
            this.studyPassword = res.password;
            // this.cardName = res.cardName;
            this.cards = res.cards;
            this.welcomeMessage = res.welcomeMessage;
            this.instructions = res.instructions;
            this.explanation = res.explanation;
            this.thankYouScreen = res.thankYouScreen;
            this.leaveFeedback = res.leaveFeedback;
            if (res.subCategories !== undefined) {
              this.subCategories = res.subCategories;
            }
            this.originalTest = this.createTestData();
          }
        );
      // get it from database
      this.randomTestId = this.id;
      // this.testName = t
    } else {
      const arrayCollection = [
        {id: 'root', parent: '#', text: 'Root', state : {
            selected : true
          }, }
      ];
      // this.createTree('test-tree', arrayCollection);
      this.originalTest = this.createTestData();
    }
  }

  createTestData() {
    return {
      testName: this.testName,
      studyPassword: this.studyPassword,
      cards: this.cards,
      welcomeMessage: this.welcomeMessage,
      instructions: this.instructions,
      explanation: this.explanation,
      thankYouScreen: this.thankYouScreen,
      leaveFeedback: this.leaveFeedback,
      subCategories: this.subCategories,
    };
  }

  reset() {
    this.testName = this.originalTest.testName;
    this.studyPassword = this.originalTest.studyPassword;
    this.cards = this.originalTest.cards;
    this.welcomeMessage = this.originalTest.welcomeMessage;
    this.instructions = this.originalTest.instructions;
    this.explanation = this.originalTest.explanation;
    this.thankYouScreen = this.originalTest.thankYouScreen;
    this.leaveFeedback = this.originalTest.leaveFeedback;
    this.subCategories = this.originalTest.subCategories;
  }

  hasChanges() {
    const originalTest = JSON.stringify(this.originalTest);
    const testAfterEditing = JSON.stringify(this.createTestData());
    return testAfterEditing != originalTest;
  }

  get isEditMode() {
    return !!this.id;
  }

  open(link: string): void {
    $('a[href="#' + link + '"]').click();
  }

  onFileLoad(fileLoadedEvent) {
    const textFromFileLoaded = fileLoadedEvent.target.result;
    this.csvContent = textFromFileLoaded;
  }

  onFileSelect(input: HTMLInputElement) {

    const files = input.files;
    // var content = this.csvContent;
    if (files && files.length) {

      const fileToRead = files[0];
      const extension = fileToRead.name.split('.');
      if (extension[extension.length - 1] !== 'csv') {
        alert('File extension is wrong! Please provide .csv file.');
        return;
      }

      const fileReader = new FileReader();
      fileReader.onload = this.onFileLoad;

      fileReader.readAsText(fileToRead, 'UTF-8');

      fileReader.onload = (e) => {
        const splitter = ',';
        const csv = fileReader.result;
        let allCards = (csv as any).split(splitter);
        if (allCards.length <= 1) {
          allCards = (csv as any).split(';');
        }
        if (allCards.length <= 1) {
          allCards = (csv as any).split(/\r?\n|\r/g);
        }

        allCards.forEach(card => {
          if (card == '')
          {
            const index = allCards.indexOf(card);
            if (index !== -1) {
                allCards.splice(index, 1);
            }
          }
        });
        this.cards = allCards;
        console.log(this.cards);
      };
    }

    (document as any).getElementById('file').value = '';

  }

  selectCard(name: string)
  {
    this.currentlySelectedCard = name;
  }

  addCard() {
    if (this.cardName === '')
    {
      return;
    }
    else
    {
      this.cards.push(this.cardName);
      this.cardName = '';
    }
  }

  renameCard() {
    const index = this.cards.indexOf(this.currentlySelectedCard);
    if (index !== -1) {
        this.cards[index] = this.cardName;
        this.cardName = '';
    }
  }

  deleteSelectedCard() {
    const index = this.cards.indexOf(this.currentlySelectedCard);
    if (index !== -1) {
        this.cards.splice(index, 1);
    }
  }

  cancel() {
    this.reset();
    this.router.navigate(['/card-sort-tests']);
  }

  saveTest(showPopup?: boolean): void {
    let passTmp = '';
    if (this.studyPassword === '') {
      passTmp = 'empty';
    } else {
      passTmp = this.studyPassword;
    }
    const study: ICardSortStudy = {
      name: this.testName,
      launched: false,
      password: passTmp,
      cards: this.cards,
      id: this.randomTestId,
      user: JSON.parse(localStorage.getItem('currentUser')).email,
      welcomeMessage: this.welcomeMessage,
      instructions: this.instructions,
      explanation: this.explanation,
      thankYouScreen: this.thankYouScreen,
      leaveFeedback: this.leaveFeedback,
      subCategories: this.subCategories,
      lastEnded: new Date(),
      lastLaunched: new Date()
    };

    if (showPopup) {
      const lang = localStorage.getItem('tt-language');
      if (lang === 'en') {
        alert('Saved!');
      }
      else {
        alert('Gespeichert!');
      }
    }
    if (!this.id) {
      this.cardSortStudyService
        .add(study)
        .subscribe(res => {
          this.id = this.randomTestId;
          this.reset();
          this.router.navigate(['/card-sort-tests']);
        });
    } else {
      this.cardSortStudyService
        .edit(study)
        .subscribe(res => {
          this.reset();
          this.router.navigate(['/card-sort-tests']);
        });
    }
  }
}
