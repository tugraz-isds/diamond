import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import {CdkDragDrop, CdkDropListGroup, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {$} from 'protractor';
import {printLine} from 'tslint/lib/verify/lines';
// @ts-ignore
// @ts-ignore
@Component({
  selector: 'app-sorting',
  templateUrl: './sorting.component.html',
  styleUrls: ['./sorting.component.css']
})


export class SortingComponent {

  // @ts-ignore
  resultGroups = [];
  @Input() isPreview: boolean;
  // tslint:disable-next-line:variable-name
  @Input() ungrouped_cards: [string];
  @Output() output = new EventEmitter<any[]>();
  groupName = '';
  iteratorGroups = 0;
  showGroupNameInput = false;

  @ViewChild('inputGroupName') inputGroupNameElementRef: ElementRef;

  openAddGroupModal() {
    // TODO: clear input
    this.groupName = '';
    this.showGroupNameInput = true;

    // TODO: focus
    setTimeout(() => {
      this.inputGroupNameElementRef.nativeElement.focus();
    }, 0);
    

    // TODO: close on focus out or on ESC

  }

  addGroup()
  {
    if (this.groupName === '') {
      this.groupName =  'New Group';
    }

    let newGroupName = this.groupName;
    while (!this.isUniqueGroupName(newGroupName)) {
      newGroupName =  this.groupName + ++this.iteratorGroups;
    }
    this.groupName = newGroupName;
    const newGroup = {group_name: this.groupName, group_list: []};
    this.resultGroups.push(newGroup);
    this.groupName = '';
    this.iteratorGroups = 0;
  }

  isUniqueGroupName(name) {
    let retval = true;
    this.resultGroups.forEach(entry => {
      console.log(entry.group_name + '/' + name);
      if (entry.group_name.toString() === name.toString()) {
        retval = false;
      }
    });
    return retval;
  }

  changeGroupName(target, id)
  {
    this.resultGroups[id].group_name = target.innerHTML.replace('<br>', '');
    this.iteratorGroups = 0;
  }

  deleteGroup(id)
  {
    if (id !== -1) {
      this.resultGroups[id].group_list.forEach(card => {
        this.ungrouped_cards.push(card);
      });
      this.resultGroups.splice(id, 1);
    }
  }

  drop(event: CdkDragDrop<string[]>) {
     if (!event.isPointerOverContainer) {
       this.addGroup();
       transferArrayItem(event.previousContainer.data,
           this.resultGroups[this.resultGroups.length - 1].group_list,
           event.previousIndex,
           0,
       );
     }
     else if (event.previousContainer === event.container) {
       moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
       console.log(event.currentIndex);
     } else {
       transferArrayItem(event.previousContainer.data,
                         event.container.data,
                         event.previousIndex,
                         event.currentIndex,
           );
     }
  }

  finish() {
    this.output.emit(this.resultGroups);
  }

  simulateDrop(target, card: any, oldgroupID) {
    const cardID = this.resultGroups[oldgroupID].group_list.findIndex(x => x === card);
    this.resultGroups[oldgroupID].group_list.splice(cardID, 1);
    this.resultGroups[target.id].group_list.push(card);
  }

  simulateDropFromUngrouped(target, card: any, oldId) {
    this.ungrouped_cards.splice(oldId, 1);
    this.resultGroups[target.id].group_list.push(card);
  }

}
