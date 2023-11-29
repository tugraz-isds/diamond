import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export class User {
    id?: string;
    email?: string;
    password?: string;
    study?: boolean;
}

interface IUser {
  id?: number;
  email: string;
  password: string;
}

export interface IUserAccount {
  email: string;
  study: boolean;
  createdDate: string;
}

interface IAddUserRequest {
  email: string;
  password: string;
  study: boolean;
}

export interface IUpdateUserAccount {
  id: string;
  email?: string;
  password?: string;
  study?: boolean;
}

@Injectable()
export class UserService {

  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Array<IUserAccount>> {
    return this.http.post<Array<IUserAccount>>(this.apiUrl, {});
  }

  getById(id: string): Observable<IUserAccount> {
    return this.http.get<IUserAccount>(`${this.apiUrl}/get/${id}`);
  }

  register(user: IUser): Observable<void> {
    const payload: IAddUserRequest = {
      email: user.email,
      password: user.password,
      study: true,
    }
    // FIXME: response is {} instead of void
    return this.http.post<void>(`${this.apiUrl}/register`, payload);
  }

  update(user: IUpdateUserAccount): Observable<void> {
    // FIXME: response is {} instead of void
    return this.http.put<void>(`${this.apiUrl}`, user);
  }

  delete(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
