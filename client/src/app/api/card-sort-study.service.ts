import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export enum CheckPasswordResponse {
  REDIRECT = 'redirect'
}

export interface ICardSortStudy {
  _id?: string; // TODO: _id should be removed?
  name: string;
  password?: string;
  launched: boolean;
  isLocked?: boolean;
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
  isLocked?: boolean;
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

export interface ICardSortStudyRequest {
  id: string;
}

export interface IGetCardSortStudyByUserIdRequest {
  user: string
}

export interface ICardSortStudyPasswordRequest {
  id: string,
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class CardSortStudyService {

  private readonly apiUrl: string = `${environment.apiUrl}/users/card-sort-study`;

  constructor(private http: HttpClient) { }

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

  add(cardSortStudy: ICardSortStudy): Observable<void> {
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
  update(cardSortStudy: ICardSortStudyEdit): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/edit`, cardSortStudy);
  }

  delete(studyId: string): Observable<void> {
    const payload: ICardSortStudyRequest = {
      id: studyId
    };
    return this.http.post<void>(`${this.apiUrl}/delete`, payload);
  }

}
