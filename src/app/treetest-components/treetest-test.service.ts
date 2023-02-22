import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ITreetestStudy } from './treetest-study.service';

export interface ITreetestTest {
  _id?: string; // INFO: this is the testId
  id: string; // INFO: this is the id of the coresponding study -> FIXME: rename to studyId
  createdDate?: string;
  results: any; // Array<IResultGroup>;
  finished?: boolean;
  username: string;
  timestamp: string;
  mindset?: string;
  feedback?: string;
  excluded?: boolean;
  showing?: boolean;
}

export interface ITreetestTestResponse {
  result: Array<ITreetestTest>;
  card_sort_test: Array<ITreetestStudy>; // FIXME: this should be renamed to "card_sort_study"
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
  
}
