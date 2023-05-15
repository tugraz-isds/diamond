import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';



import { AppComponent } from './app.component';
import { CardsortStudiesComponent } from './cardsort-components/cardsort-studies/cardsort-studies.component';
import { LoginComponent } from './login/login.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RegisterComponent } from './register/register.component';
import { TreetestStudiesComponent } from './treetest-components/treetest-studies/treetest-studies.component';

import { AdminComponent } from './admin/admin.component';
import { AlertService } from './alert.service';
import { AuthenticationService } from './authentification.service';
import { CardsortTestsComponent } from './cardsort-components/cardsort-tests/cardsort-tests.component';
import { CreateTestComponent } from './treetest-components/create-treetest-study/create-tree-test.component';
import { PathtreeComponent } from './treetest-components/pathtree/pathtree.component';
import { TreetestStudyComponent } from './treetest-components/treetest-study/treetest-study.component';
import { TreetestTestsComponent } from './treetest-components/treetest-tests/treetest-tests.component';
import { UserService } from './user.service';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CardListComponent } from './cardsort-components/card-list/card-list.component';
import { CardsortStudyComponent } from './cardsort-components/cardsort-study/cardsort-study.component';
import { CreateCardSortComponent } from './cardsort-components/create-cardsort-study/create-card-sort.component';
import { SortingComponent } from './cardsort-components/sorting/sorting.component';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { CardsortTestMatrixComponent } from './cardsort-components/cardsort-test-matrix/cardsort-test-matrix.component';

import { participantsFilterPipe } from 'src/app/pipes/filter.pipe';
import { PendingChangesGuard } from './guard';
import { JwtInterceptor } from './jwt.interceptor';
import { LanguageService } from './language.service';
import { datePipe } from './pipes/datePipe.pipe';
import { StudyClosedComponent } from './study-closed/study-closed.component';
import { AuthGuard } from './auth.guard';
import { AuthRedirectGuard } from './auth-redirect.guard';
import { FooterComponent } from './footer/footer.component';

const appRoutes: Routes = [
  { path: 'admin', component: AdminComponent, canActivate: [ AuthGuard ]},
  { path: 'create-tree-test', component: CreateTestComponent, canDeactivate: [PendingChangesGuard], canActivate: [ AuthGuard ]},
  { path: 'create-card-sort', component: CreateCardSortComponent, canDeactivate: [PendingChangesGuard], canActivate: [ AuthGuard ]},
  { path: 'create-tree-test/:id', component: CreateTestComponent, canDeactivate: [PendingChangesGuard], canActivate: [ AuthGuard ]},
  { path: 'create-card-sort/:id', component: CreateCardSortComponent, canDeactivate: [PendingChangesGuard], canActivate: [ AuthGuard ]},
  { path: 'cardsort/:id', component: CardsortStudyComponent},
  { path: 'cardsort-preview/:id', component: CardsortStudyComponent, canActivate: [ AuthGuard ]},
  { path: 'treetest/:id', component: TreetestStudyComponent},
  { path: 'treetest-preview/:id', component: TreetestStudyComponent, canActivate: [ AuthGuard ]},
  { path: 'results/:id', component: TreetestTestsComponent, canActivate: [ AuthGuard ]},
  { path: 'card-sort-results/:id', component: CardsortTestsComponent, canActivate: [ AuthGuard ]},
  { path: 'login', component: LoginComponent,canActivate: [ AuthRedirectGuard ]},
  { path: 'register', component: RegisterComponent,canActivate: [ AuthRedirectGuard ]},
  { path: 'tests', component: TreetestStudiesComponent, canActivate: [ AuthGuard ]},
  { path: 'card-sort-tests', component: CardsortStudiesComponent, canActivate: [ AuthGuard ]},
  { path: 'pie-tree/:id/:index', component: PathtreeComponent, canActivate: [ AuthGuard ] },
  {path: 'study-closed', component: StudyClosedComponent},
  { path: '**', redirectTo: 'tests', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    TreetestStudiesComponent,
    CardsortStudiesComponent,
    RegisterComponent,
    CreateTestComponent,
    TreetestStudyComponent,
    TreetestTestsComponent,
    CardsortTestsComponent,
    PathtreeComponent,
    AdminComponent,
    CreateCardSortComponent,
    CardsortStudyComponent,
    CardListComponent,
    CardsortTestMatrixComponent,
    SortingComponent,
    participantsFilterPipe,
    datePipe,
    StudyClosedComponent,
    FooterComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    RouterModule.forRoot(appRoutes),
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
    // TranslationService,
    LanguageService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    PendingChangesGuard,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function createTranslateLoader(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}
