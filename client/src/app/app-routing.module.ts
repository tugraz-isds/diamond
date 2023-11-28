import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./modules/login/login.module').then(module => module.LoginModule),
  }, {
    path: 'tree-testing',
    loadChildren: () => import('./modules/tree-testing/tree-testing.module').then(module => module.TreeTestingModule),
  }, {
    path: 'card-sorting',
    loadChildren: () => import('./modules/card-sorting/card-sorting.module').then(module => module.CardSortingModule),
  }, {
    path: '**', redirectTo: '/login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
