import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LayoutsModule } from 'src/app/common/layouts/layouts.module';
import { MaterialModule } from 'src/app/common/material.module';
import { StudyListPageComponent } from './pages/study-list-page/study-list-page.component';
import { CardSortingRoutingModule } from './card-sorting-routing.module';


@NgModule({
  declarations: [
    StudyListPageComponent
  ],
  imports: [
    CommonModule,
    CardSortingRoutingModule,
    RouterModule,
    MaterialModule,
    LayoutsModule
  ]
})
export class CardSortingModule { }

