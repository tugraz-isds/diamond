import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as UserPaths from '../../server/user-paths.js';
import { Observable } from 'rxjs';

export class User {
    id?: string;
    email?: string;
    password?: string;
    study?: boolean;
}

@Injectable()
export class UserService {

    public serverUrl = UserPaths.server_url;

    constructor(private http: HttpClient) { }

    getAll(): Observable<Array<User>> {
        return this.http.post<Array<User>>(this.serverUrl + '/users', {});
    }

    getById(id: string): Observable<User> {
        return this.http.get<User>(this.serverUrl + `/users/` + id);
    }

    register(user: User): Observable<void> {
        user.study = true;
        return this.http.post<void>(this.serverUrl + `/users/register`, user);
    }

    update(user: User) {
        return this.http.put(this.serverUrl + `/users`, user);
    }

    delete(id: string): Observable<void> {
        const payload: User = { id };
        return this.http.post<void>(`/users`, payload);
    }
}
