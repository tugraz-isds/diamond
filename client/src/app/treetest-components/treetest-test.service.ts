import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IFeedbackRequest } from '../cardsort-components/card-sort-test.service';
import { ITreetestStudy } from './treetest-study.service';

export interface ITreetestResult {
  clicks: Array<any>; // Array of clicked tree nodes see
  answer: string; // Id of the selected node
  time: number;
}

export interface ITreetestTest {
  _id?: string; // INFO: this is the testId
  id: string; // INFO: this is the id of the coresponding study -> FIXME: rename to studyId
  createdDate?: string;
  results?: any; // Array<IResultGroup>;
  finished?: boolean;
  username: string;
  timestamp: string;
  mindset?: string;
  feedback?: string;
  excluded?: boolean;
  showing?: boolean;
  include?: boolean;
}

export interface ITreetestTestResponse {
  result: Array<ITreetestTest>;
  test: Array<ITreetestStudy>; // FIXME: this should be renamed to "card_sort_study"
}

interface ITreetestTestRequest {
  id: string;
}

@Injectable({
  providedIn: 'root'
})
export class TreetestTestService {

  private readonly apiUrl: string = `${environment.apiUrl}/users/tree-tests`;

  constructor(private http: HttpClient) { }

  getById(studyId: string): Observable<ITreetestTestResponse> {
    return this.http.post<ITreetestTestResponse>(`${this.apiUrl}/get/${studyId}`, null);
  }

  add(treetestTest: ITreetestTest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/add`, treetestTest);
  }

  addMultiple(treetestTests: Array<ITreetestTest>): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/add-multiple`, treetestTests);
  }

  update(treetestTest: ITreetestTest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/edit`, treetestTest);
  }

  delete(testId: string): Observable<void> {
    const payload: ITreetestTestRequest = {
      id: testId
    };
    return this.http.post<void>(`${this.apiUrl}/delete`, payload);
  }

  feedback(username: string, feedback: string): Observable<void> {
    const payload: IFeedbackRequest = {
      username,
      feedback
    };
    return this.http.post<void>(`${this.apiUrl}/feedback`, payload);
  }

}
