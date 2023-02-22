import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface IParticipant {
  id: string;
  participants: number;
}

export interface ITreetestStudy {
  _id?: string; // TODO: _id should be removed?
  name: string;
  password?: string;
  launched?: boolean;
  id: string;
  createdDate?: string;
  tree: any;
  tasks: any;
  user: string;
  welcomeMessage?: string;
  instructions?: string;
  thankYouScreen?: string;
  leaveFeedback?: string;
  leafNodes?: any;
  orderNumbers?: any;
  lastEnded: string | Date;
  lastLaunched: string | Date;
  isLaunchable?: boolean;
  numberOfParticipants?: number;
}

interface ITreetestStudyRequest {
  id: string;
}

export interface ITreetestStudyEdit {
  id: string;
  launched?: boolean;
  lastLaunched?: Date;
  lastEnded?: Date;
}

interface IGetTreetestStudyByUserIdRequest {
  user: string
}

@Injectable({
  providedIn: 'root'
})
export class TreetestStudyService {

  private readonly apiUrl: string = `${environment.apiUrl}/users/tree-study`;

  constructor(private http: HttpClient) { }

  get(studyId: string): Observable<ITreetestStudy> {
    const payload: ITreetestStudyRequest = {
      id: studyId
    };
    return this.http.post<ITreetestStudy>(`${this.apiUrl}/get`, payload);
  }

  getAllByUserId(email: string): Observable<Array<ITreetestStudy>> {
    const payload: IGetTreetestStudyByUserIdRequest = {
      user: email
    };
    return this.http.post<Array<ITreetestStudy>>(`${this.apiUrl}/getbyuserid`, payload);
  }

  add(treetestStudy: ITreetestStudy): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/add`, treetestStudy);
  }

  // FIXME: we dont need the whole object here, just the updated property should be allowed
  edit(treetestStudy: ITreetestStudyEdit | ITreetestStudy): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/edit`, treetestStudy);
  }

  delete(studyId: string): Observable<void> {
    const payload: ITreetestStudyRequest = {
      id: studyId
    };
    return this.http.post<void>(`${this.apiUrl}/delete`, payload);
  }
  
}
