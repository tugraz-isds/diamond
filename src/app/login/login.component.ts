import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../authentification.service';
import { AlertService } from '../alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  errorMessage = "";

  constructor(
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private authenticationService: AuthenticationService,
      private alertService: AlertService) {}

  ngOnInit() {
        if (localStorage.getItem('currentUser')) {
            this.router.navigate(['/tests']);
        } else {
            this.loginForm = this.formBuilder.group({
                email: ['', Validators.required],
                password: ['', Validators.required]
            });

            // reset login status
            this.authenticationService.logout();

            // get return url from route parameters or default to '/'
            // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
            this.returnUrl = '/';
        }
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit() {
      this.submitted = true;

      // stop here if form is invalid
      if (this.loginForm.invalid) {
          return;
      }

      this.loading = true;
      this.authenticationService.login(this.f.email.value, this.f.password.value)
          .pipe(first())
          .subscribe(
              data => {
                  this.authenticationService.loggedIn = true;
                  this.router.navigate(['tests']);
              },
              error => {
                  this.errorMessage = error.error.message;
                  this.alertService.error(error);
                  this.loading = false;
              });
  }

}
