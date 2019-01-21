import { AuthenticationService } from 'src/app/services/authentication.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './registration.component.html',
})
export class RegistrationComponent implements OnInit {
  constructor(private fb: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService) {}

  public form: FormGroup;

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      login:  ['', [Validators.required]] ,
      password: ['', [Validators.required]],
      secondPassword: ['', [Validators.required]]
    });
  }

  public registrate() {
    const password = this.form.controls.password.value;
    const secondPassword = this.form.controls.password.value;
    const userName = this.form.controls.login.value;
    if (password === secondPassword) {
      const user = {
        name: userName,
        password: password
      };
      this.authenticationService.createUser(user).subscribe(res => {
        this.router.navigate(['/login']);
      });
    }
  }

}
