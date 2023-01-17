import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from '../user.service';
import { ICardSortStudy } from './card-sort-study.service';

export interface IResultGroup {
  group_name: string;
  group_list: Array<string>;
}

export interface ICardSortTest {
  id: string;
  createdDate?: string;
  results: Array<IResultGroup>;
  finished?: boolean;
  username: string;
  timestamp: string;
  mindset?: string;
  feedback?: string;
  excluded?: boolean;
}

export interface ICardSortTestResponse {
  result: Array<ICardSortTest>;
  card_sort_test: Array<ICardSortStudy>;
}

export interface IMindsetRequest {
  username: string;
  mindset: string;
};

export interface IFeedbackRequest {
  username: string;
  feedback: string;
};

@Injectable({
  providedIn: 'root'
})
export class CardSortTestService {

  private readonly apiUrl: string;

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) { 
    this.apiUrl = `${this.userService.serverUrl}/users/card-sort-tests`;
  }

  getById(studyId: string): Observable<ICardSortTestResponse> {
    return this.http.post<ICardSortTestResponse>(`${this.apiUrl}/${studyId}`, null);
  }

  add(cardSortTest: ICardSortTest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/add`, cardSortTest);
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
}
