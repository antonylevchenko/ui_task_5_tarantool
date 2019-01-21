import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  constructor(private fb: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService) {}

  public form: FormGroup;


  ngOnInit() {
    this.authenticationService.checkIfLoggedIn().subscribe(res => {
      if (res) {
        this.router.navigate(['/logged-in']);
      }
    });
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      login:  ['', [Validators.required]] ,
      password: ['', [Validators.required]]
    });
  }

  public login() {
    const user = {
      name: this.form.controls.login.value,
      password: this.form.controls.password.value
    };
    this.authenticationService.login(user).subscribe(res => {
      if (res) {
        this.router.navigate(['/logged-in']);
      }
    });
  }

  public routeToRegistration() {
    console.log('navigationf');
    this.router.navigate(['/registration']);
  }


}
