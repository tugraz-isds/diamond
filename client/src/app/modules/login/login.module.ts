import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/common/material.module';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { DefaultLayoutComponent } from 'src/app/common/layouts/default/default-layout.component';

@NgModule({
  declarations: [
    LoginPageComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: DefaultLayoutComponent,
        children: [
          {
            path: '',
            component: LoginPageComponent
          }, {
            path: '**',
            redirectTo: ''
          }
        ]
      }
    ])
  ]
})
export class LoginModule { }

