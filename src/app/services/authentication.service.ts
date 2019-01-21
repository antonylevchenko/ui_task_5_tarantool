import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import {Md5} from 'ts-md5';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthenticationService {
  private apiUrl = '/api/authentication/';

  public userName: string;
  public loggedIn: boolean;

  constructor(
    private httpClient: HttpClient
  ) { }

  createUser(user: any): Observable<any> {
    const userForSending = {
      name: user.name,
      password: this.getHashForPassword(user.password)
    };
    console.log(userForSending);
    return this.httpClient.post(this.apiUrl + 'create-user', userForSending);
  }

  getHashForPassword(password: string) {
    const result = Md5.hashStr(password);
    return result;
  }

  login(user: any): Observable<any> {
    const userForSending = {
      name: user.name,
      password: this.getHashForPassword(user.password)
    };
    console.log(userForSending);
    return this.httpClient.post(this.apiUrl + 'login', userForSending)
    .pipe(map((res: any) => {
      if (res.loggedIn) {
        this.userName = res.name;
        this.loggedIn = res.loggedIn;
        return true;
      } else {
        return false;
      }
    }));
  }

  checkIfLoggedIn(): Observable<any> {
    return this.httpClient.get(this.apiUrl + 'check-if-logged')
    .pipe(map((res: any) => {
      if (res.loggedIn) {
        this.userName = res.name;
        this.loggedIn = res.loggedIn;
        return true;
      } else {
        return false;
      }
    }));
  }

  logOut(): Observable<any> {
    return this.httpClient.get(this.apiUrl + 'logout');
  }
}
