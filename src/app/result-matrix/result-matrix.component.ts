import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

import { UserService } from '../user.service';


declare var $: any;

@Component({
  selector: 'app-result-matrix',
  templateUrl: './result-matrix.component.html',
  styleUrls: ['./result-matrix.component.css', '../app.component.css']
})

export class ResultMatrixComponent implements OnInit {
  @Input() result;
  @Output() output = new EventEmitter<any[]>();

  categories = [];
  matrix = [];

  numCategories = 0;
  maxCards = 0;
  maxCardIndex = 0;


  ngOnInit() {
    let index = 0
    for(let groupList of this.result.results){
      this.categories.push(groupList.group_name);

      let cards = []
      let numCards = 0;

      for(let cardName of groupList.group_list){
        cards.push(cardName);
        numCards++;
      }
      if(numCards > this.maxCards){
        this.maxCards = numCards;
        this.maxCardIndex = index;
      }
      this.matrix.push(cards)
      this.numCategories++;
      index++;
    }

  }

  close(){
    this.output.emit();
  }
}
