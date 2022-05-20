import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as UserPaths from '../../server/user-paths.js';

export class User {
    id: number;
    email: string;
    password: string;
}

@Injectable()
export class UserService {

    serverUrl = UserPaths.server_url;

    constructor(private http: HttpClient) { }

    getAll() {
        const header = new Headers({ Authorization: 'Bearer ' + (JSON.parse(localStorage.getItem('currentUser'))).token});
        const httpOptions = {
            headers: new HttpHeaders({
            'Content-Type':  'application/json',
            Authorization: 'Bearer ' + (JSON.parse(localStorage.getItem('currentUser'))).token
          })
      };
      // http://localhost:48792
        return this.http.post(this.serverUrl + '/users', {}, httpOptions);


        // http://localhost:48792
        // return this.http.get<User[]>(this.serverUrl + `/users`);
    }

    getById(id: number) {
        // http://localhost:48792
        return this.http.get(this.serverUrl + `/users/` + id);
    }

    register(user) {
        // http://localhost:48792
        user.study = true;
        return this.http.post(this.serverUrl + `/users/register`, user);
    }

    update(user) {
        const header = new Headers({ Authorization: 'Bearer ' + (JSON.parse(localStorage.getItem('currentUser'))).token});
        const httpOptions = {
            headers: new HttpHeaders({
            'Content-Type':  'application/json',
            Authorization: 'Bearer ' + (JSON.parse(localStorage.getItem('currentUser'))).token
          })
      };
        // http://localhost:48792
        return this.http.put(this.serverUrl + `/users/` + user.email, user, httpOptions);
    }

    delete(id: number) {
        // http://localhost:48792
        return this.http.delete(`/users/` + id);
    }
}
