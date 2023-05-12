import { Component, ViewChild } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  @ViewChild('form') form!: NgForm;
  @ViewChild('email') email!: NgModel;
  @ViewChild('password') password!: NgModel;
  formTouched = false;

  constructor(private authService: AuthService) {}

  onSubmit() {
    this.formTouched = true;
    if (!this.form.valid) return;

    this.authService.login(this.email?.value, this.password.value);
  }
}
