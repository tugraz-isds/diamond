import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './security/auth.guard';
import { authRedirectGuard } from './security/auth-redirect.guard';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./modules/login/login.module').then(module => module.LoginModule),
    canActivate: [authRedirectGuard]
  }, {
    path: 'tree-testing',
    loadChildren: () => import('./modules/tree-testing/tree-testing.module').then(module => module.TreeTestingModule),
    canActivate: [authGuard]
  }, {
    path: 'card-sorting',
    loadChildren: () => import('./modules/card-sorting/card-sorting.module').then(module => module.CardSortingModule),
    canActivate: [authGuard]
  }, {
    path: '**', redirectTo: '/login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
