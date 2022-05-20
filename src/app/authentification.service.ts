import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { UserService } from './user.service';

@Injectable()
export class AuthenticationService {
    loggedIn = false;
    user;
    studyAccess = false;
    constructor(private http: HttpClient, private userService: UserService) {
     }

    login(email: string, password: string) {
        //return this.http.post<any>(`http://localhost:48792/users/
        return this.http.post<any>(this.userService.serverUrl + `/users/authenticate`, { email, password })
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

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }
}
