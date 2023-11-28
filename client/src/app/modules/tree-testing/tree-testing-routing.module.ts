
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultLayoutComponent } from 'src/app/common/layouts/default/default-layout.component';
import { StudyListPageComponent } from './pages/study-list-page/study-list-page.component';

const routes: Routes = [
  {
    path: '',
    component: DefaultLayoutComponent,
    children: [
      {
        path: 'study-list',
        component: StudyListPageComponent,
      }, {
        path: '**',
        redirectTo: 'study-list'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TreeTestingRoutingModule { }
