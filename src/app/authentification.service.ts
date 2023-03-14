import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { IUserAccount } from './user.service';


export interface ILoginResponse extends IUserAccount {
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

  private static CURRENT_USER_KEY = 'diamond-current-user';

  private currentUser: ILoginResponse;

  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {
    this.loadCurrentUser();
  }

  login(email: string, password: string): Observable<ILoginResponse> {

    const payload: ILoginRequest = { email, password };

    return this.http
      .post<ILoginResponse>(`${this.apiUrl}/authenticate`, payload)
      .pipe(tap(res => {
        // login successful if there's a jwt token in the response
        if (res && res.token) {
          this.saveCurrentUser(res);
        }
      }));
    }

    logout(): void {
      this.clear();
    }

    isLoggedIn(): boolean{
      if (!this.currentUser) {
        this.loadCurrentUser();
      }
      return !!this.currentUser?.token;
    }

    clear(): void {
      this.currentUser = undefined;
      localStorage.removeItem(AuthenticationService.CURRENT_USER_KEY);
    }

    userCan(feature: string): boolean {
      if (!this.getCurrentUser()) {
        return false;
      }
      switch (feature) {
        case 'studyAccess':
          return this.getCurrentUser().study;
        default:
          return false;
      }
    }

    getAccessToken(): string {
      if (!this.currentUser) {
        this.loadCurrentUser();
      }
      return this.currentUser?.token;
    }

    getCurrentUser(): ILoginResponse {
      if (!this.currentUser) {
        this.loadCurrentUser();
      }
      return this.currentUser;
    }

    isAdmin(): boolean {
      if (!this.currentUser) {
        this.loadCurrentUser();
      }
      return this.currentUser?.email === 'admin';
    }

    private saveCurrentUser(user?: ILoginResponse): void {
      if (!user) {
        user = this.currentUser;
      } else {
        this.currentUser = user;
      }
      localStorage.setItem(AuthenticationService.CURRENT_USER_KEY, JSON.stringify(user));
    }

    private loadCurrentUser(): void {
      const currentUserStr = localStorage.getItem(AuthenticationService.CURRENT_USER_KEY);
      if (currentUserStr) {
        this.currentUser = JSON.parse(currentUserStr);
      } else {
        this.currentUser = undefined;
      }
    }
}
