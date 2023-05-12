import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  @ViewChild('form') form!: NgForm;
  @ViewChild('email') email!: NgModel;
  @ViewChild('password') password!: NgModel;
  @ViewChild('passwordRepeat') passwordRepeat!: NgModel;
  formTouched = false;

  constructor(private authService: AuthService) {}

  onSubmit() {
    this.formTouched = true;

    if (!this.form.valid || this.password.value !== this.passwordRepeat.value)
      return;

    this.authService.register(
      this.email.value,
      this.password.value,
      this.passwordRepeat.value
    );
  }
}
