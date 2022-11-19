import { Component, Input, Output, EventEmitter} from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

declare var $: any;

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.css']
})


export class CardListComponent {

  @Input() cards: [string];

  @Output() selectedEvent = new EventEmitter<string>();

  selectedCard(event, name)
  {
    document.querySelectorAll<HTMLElement>('.card').forEach(element => {
      element.style.background = 'white';
    });
    event.target.style.backgroundColor = 'lightgrey';
    this.selectedEvent.emit(name);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.cards, event.previousIndex, event.currentIndex);
  }

}
