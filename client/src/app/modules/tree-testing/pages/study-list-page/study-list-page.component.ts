import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AuthenticationService, ILoginResponse } from 'src/app/api/authentification.service';
import { IParticipant, ITreetestStudy, TreetestStudyService } from 'src/app/api/treetest-study.service';
import { TreetestTestService } from 'src/app/api/treetest-test.service';

@Component({
  selector: 'app-study-list-page',
  templateUrl: './study-list-page.component.html',
  styleUrls: ['./study-list-page.component.scss']
})
export class StudyListPageComponent implements OnInit {

  public isLoading = true;

  private currentUser: ILoginResponse;

  //number of participants for each study
  public numberParticipants: Array<IParticipant> = [];

  public studyList: Array<ITreetestStudy> = [];

  public studyListDataSource: MatTableDataSource<ITreetestStudy>;

  public displayedColumns: string[] = [ 'id', 'name', 'url', 'participants', 'action', 'createdBy', 'created', 'lastLaunched', 'lastEnded' ];

  public selectedStudy: ITreetestStudy;

  private baseurl: string;

  constructor(
    public authService: AuthenticationService,
    private router: Router,
    private treetestStudyService: TreetestStudyService,
    private treetestTestService: TreetestTestService
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.baseurl = location.origin;
    this.getAllTests();
  }

  getAllTests(): void {
    this.isLoading = true;
    this.treetestStudyService
      .getAllByUserId(this.currentUser?.email)
      .subscribe(res => {
        this.studyList = res;
        this.refreshDataSource();
      })
      .add(() => this.isLoading = false);
  }

  refreshDataSource(): void {
    this.studyListDataSource = new MatTableDataSource(this.studyList);
  }

  onDeleteStudy($event: MouseEvent, study: ITreetestStudy): void {

  }

  onSelectStudy(study: ITreetestStudy): void {

  }

  getStudyUrl(study: ITreetestStudy): string {
    return `${this.baseurl}/#/treetest/${study.id}`;
  }
}
