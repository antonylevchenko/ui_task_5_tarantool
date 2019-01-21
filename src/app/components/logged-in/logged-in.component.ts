import { AuthenticationService } from 'src/app/services/authentication.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-logged-in',
  templateUrl: './logged-in.component.html',
})
export class LoggedInComponent implements OnInit {

  public userName: string;

  constructor(private authenticationService: AuthenticationService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.userName = this.authenticationService.userName;
  }

  public logout() {
    this.authenticationService.logOut().subscribe(res => {
      this.router.navigate(['/login']);
    });
  }


  public goToLogin() {
    this.router.navigate(['/login']);
  }

}
