import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ICardSortStudy } from './card-sort-study.service';

export interface IResultGroup {
  group_name: string;
  group_list: Array<string>;
}

export interface ICardSortTest {
  _id?: string; // INFO: this is the testId
  id?: string; // INFO: this is the id of the coresponding study -> FIXME: rename to studyId
  createdDate?: string;
  results: Array<IResultGroup>;
  finished?: boolean;
  username: string;
  timestamp: string;
  mindset?: string;
  feedback?: string;
  excluded?: boolean;
  showing?: boolean;
}

export interface ICardSortTestResponse {
  result: Array<ICardSortTest>;
  card_sort_test: Array<ICardSortStudy>; // FIXME: this should be renamed to "card_sort_study"
}

export interface IMindsetRequest {
  username: string;
  mindset: string;
};

export interface IFeedbackRequest {
  username: string;
  feedback: string;
};

export interface IDeleteTestRequest {
  id: string;
}

@Injectable({
  providedIn: 'root'
})
export class CardSortTestService {

  private readonly apiUrl: string = `${environment.apiUrl}/users/card-sort-tests`;

  constructor(private http: HttpClient) { }

  getById(studyId: string): Observable<ICardSortTestResponse> {
    return this.http.post<ICardSortTestResponse>(`${this.apiUrl}/get/${studyId}`, null);
  }

  add(cardSortTest: ICardSortTest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/add`, cardSortTest);
  }

  addMultiple(cardSortTests: Array<ICardSortTest>): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/add-multiple`, cardSortTests);
  }

  mindset(username: string, mindset: string): Observable<void> {
    const payload: IMindsetRequest = {
      username,
      mindset
    };
    return this.http.post<void>(`${this.apiUrl}/mindset`, payload);
  }

  feedback(username: string, feedback: string): Observable<void> {
    const payload: IFeedbackRequest = {
      username,
      feedback
    };
    return this.http.post<void>(`${this.apiUrl}/feedback`, payload);
  }

  delete(id: string): Observable<void> {
    const payload: IDeleteTestRequest = {
      id
    };
    return this.http.post<void>(`${this.apiUrl}/delete`, payload);
  }

  update(test: ICardSortTest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/edit`, test);
  }
}
