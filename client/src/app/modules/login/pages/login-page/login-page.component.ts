import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/api/authentification.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {

  public isLoading: boolean = false;

  public form: FormGroup = this.fb.group({
    username: ['', [ Validators.required ] ],
    password: ['', [ Validators.required ] ]
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthenticationService
  ) { }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  processLoginResponse(res: any): void {
    this.router.navigate(['tree-testing']);
  }

  onSubmit(event: SubmitEvent, formValue: AbstractControl): void {

    if (this.form.invalid) {
      // TODO: show error message
      // this.notifier.notify('error', 'Invalide Formulardaten');
      return;
    }

    this.isLoading = true;

    this.authService
      .login(this.f['username'].value, this.f['password'].value)
      .subscribe({
        next: res => this.processLoginResponse(res),
        error: err => console.log(err)
      })
      .add(() => this.isLoading = false);

  }
}
