import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { UserService } from './user.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

// TODO: we may rename this to IUser ?
export interface ILoginResponse {
    email: string;
    study: boolean;
    createDate: string;
    token: string;
}

interface ILoginRequest {
  email: string;
  password: string;
}

@Injectable()
export class AuthenticationService {

  private apiUrl = `${environment.apiUrl}/users`;

  public loggedIn: boolean = false;
  public user: ILoginResponse;
  public studyAccess: boolean = false;

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<ILoginResponse> {

    const payload: ILoginRequest = { email, password };

    return this.http.post<ILoginResponse>(`${this.apiUrl}/authenticate`, payload)
      .pipe(map(user => {
        // login successful if there's a jwt token in the response
        if (user && user.token) {
          this.user = user;
          this.studyAccess = this.user.study;
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
        return user;
      }));
    }

    logout(): void {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }

    getCurrentUser(): ILoginResponse {
        return JSON.parse(localStorage.getItem('currentUser'));
    }

    getAccessToken(): string {
        const currentUser = this.getCurrentUser();
        return currentUser?.token;
    }
}
