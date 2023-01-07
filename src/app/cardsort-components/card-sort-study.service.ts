import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from '../user.service';

export enum CheckPasswordResponse {
  REDIRECT = 'redirect'
}

export interface ICardSortStudy {
  _id?: string;
  name: string;
  password?: string;
  launched: boolean;
  id: string;
  createdDate?: string;
  cards: Array<any>;
  user: string;
  welcomeMessage?: string;
  instructions?: string;
  explanation?: string;
  thankYouScreen?: string;
  leaveFeedback?: string;
  subCategories?: boolean;
  lastEnded: string | Date;
  lastLaunched: string | Date;
  numberOfParticipants?: number;
}

export interface ICardSortStudyEdit {
  _id?: string;
  name?: string;
  password?: string;
  launched?: boolean;
  id: string;
  createdDate?: string;
  cards?: Array<any>;
  user?: string;
  welcomeMessage?: string;
  instructions?: string;
  explanation?: string;
  thankYouScreen?: string;
  leaveFeedback?: string;
  subCategories?: boolean;
  lastEnded?: string | Date;
  lastLaunched?: string | Date;
}

interface ICardSortStudyRequest {
  id: string;
}

interface IGetCardSortStudyByUserIdRequest {
  user: string
}

interface ICardSortStudyPasswordRequest {
  id: string,
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class CardSortStudyService {

  private readonly apiUrl: string;

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) { 
    this.apiUrl = `${this.userService.serverUrl}/users/card-sort-study`;
  }

  get(studyId: string): Observable<ICardSortStudy> {
    const payload: ICardSortStudyRequest = {
      id: studyId
    };
    return this.http.post<ICardSortStudy>(`${this.apiUrl}/get`, payload);
  }

  getAllByUserId(email: string): Observable<Array<ICardSortStudy>> {
    const payload: IGetCardSortStudyByUserIdRequest = {
      user: email
    };
    return this.http.post<Array<ICardSortStudy>>(`${this.apiUrl}/getbyuserid`, payload);
  }

  add(cardSortStudy: ICardSortStudy) {
    return this.http.post<void>(`${this.apiUrl}/add`, cardSortStudy);
  }

  checkPassword(studyId: string, password: string): Observable<ICardSortStudy | boolean> {
    const payload: ICardSortStudyPasswordRequest = {
      id: studyId,
      password
    };
    return this.http.post<ICardSortStudy | boolean>(`${this.apiUrl}/password`, payload);
  }

  passwordRequired(studyId: string): Observable<CheckPasswordResponse | boolean> {
    const payload: ICardSortStudyRequest = {
      id: studyId
    };
    return this.http.post<CheckPasswordResponse | boolean>(`${this.apiUrl}/passwordrequired`, payload);
  }

  // FIXME: we dont need the whole object here, just the updated property should be allowed
  edit(cardSortStudy: ICardSortStudyEdit): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/edit`, cardSortStudy);
  }

  delete(studyId: string): Observable<void> {
    const payload: ICardSortStudyRequest = {
      id: studyId
    };
    return this.http.post<void>(`${this.apiUrl}/delete`, payload);
  }

}
