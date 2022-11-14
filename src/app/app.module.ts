import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';



import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { TreetestStudiesComponent } from './treetest-studies/treetest-studies.component';
import { CardSortTestsComponent } from './card-sort-studies/card-sort-tests.component';
import { RegisterComponent } from './register/register.component';

import { AuthenticationService } from './authentification.service';
import { AlertService } from './alert.service';
import { UserService } from './user.service';
import { CreateTestComponent } from './create-tree-test-study/create-tree-test.component';
import { TreetestStudyComponent } from './treetest-study/treetest-study.component';
import { TreetestTestsComponent } from './treetest-tests/treetest-tests.component';
import { CardSortResultsComponent } from './card-sort-tests/card-sort-results.component';
import { PietreeComponent } from './pietree/pietree.component';
import { AdminComponent } from './admin/admin.component';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslationService } from './translate.service';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CreateCardSortComponent } from './create-card-sort-study/create-card-sort.component';
import { CardSortTestComponent } from './card-sort-study/card-sort-test.component';
import { CardListComponent } from './card-list/card-list.component';
import { SortingComponent } from './sorting/sorting.component';

import { DragDropModule } from '@angular/cdk/drag-drop';
import {TestMatrixComponent} from './test-matrix/test-matrix.component';

import {participantsFilterPipe} from 'src/app/pipes/filter.pipe';
import {datePipe} from './pipes/datePipe.pipe';
import { StudyClosedComponent } from './study-closed/study-closed.component';

const appRoutes: Routes = [
  { path: 'admin', component: AdminComponent},
  { path: 'create-tree-test', component: CreateTestComponent},
  { path: 'create-card-sort', component: CreateCardSortComponent},
  { path: 'create-tree-test/:id', component: CreateTestComponent},
  { path: 'create-card-sort/:id', component: CreateCardSortComponent},
  { path: 'card-sort-test/:id', component: CardSortTestComponent},
  { path: 'test/:id', component: TreetestStudyComponent},
  { path: 'results/:id', component: TreetestTestsComponent},
  { path: 'card-sort-results/:id', component: CardSortResultsComponent},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'tests', component: TreetestStudiesComponent},
  { path: 'card-sort-tests', component: CardSortTestsComponent},
  { path: 'pie-tree/:id/:index', component: PietreeComponent },
  {path: 'study-closed', component: StudyClosedComponent},
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    TreetestStudiesComponent,
    CardSortTestsComponent,
    RegisterComponent,
    CreateTestComponent,
    TreetestStudyComponent,
    TreetestTestsComponent,
    CardSortResultsComponent,
    PietreeComponent,
    AdminComponent,
    CreateCardSortComponent,
    CardSortTestComponent,
    CardListComponent,
    TestMatrixComponent,
    SortingComponent,
    participantsFilterPipe,
    datePipe,
    StudyClosedComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    RouterModule.forRoot(appRoutes, { relativeLinkResolution: 'legacy' }),
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    DragDropModule
  ],
  exports: [RouterModule],
  providers: [
    AuthenticationService,
    AlertService,
    UserService,
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    TranslationService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function createTranslateLoader(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}
