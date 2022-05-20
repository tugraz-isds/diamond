import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

import { UserService } from '../user.service';
import { AuthenticationService } from '../authentification.service';

import { Router, ActivatedRoute } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-tests',
  templateUrl: './card-sort-tests.component.html',
  styleUrls: ['./card-sort-tests.component.css', '../app.component.css']
})
export class CardSortTestsComponent implements OnInit {
  cardSortTests;
  deleteCardSortTestId;
  baseurl = "";

  constructor(private http: HttpClient, private userService: UserService, public authService: AuthenticationService, private router: Router) { }

  ngOnInit() {
    $('[data-toggle="tooltip"]').tooltip();
    this.baseurl = location.origin;
    this.getAllCardSortTests();
  }

  getAllCardSortTests() {
    const data = {
        user: JSON.parse(localStorage.getItem('currentUser')).email
    };
    this.getCardSortTestData(data)
    .subscribe(
      res => {
        this.cardSortTests = res;
      },
      err => {
      }
    );
  }

  copyToClipboard(studyId) {

    $('#copyboardtest').append('<textarea id="copyboard"></textarea>');
    $('#copyboard').val(this.baseurl + "/#/card-sort-test/" + studyId);

    const input = document.getElementById('copyboard');
    const isiOSDevice = navigator.userAgent.match(/ipad|iphone/i);

    if (isiOSDevice) {

      const editable = input.contentEditable;
      const readOnly = (<any>input).readOnly;

      (<any>input).contentEditable = true;
      (<any>input).readOnly = false;

      const range = document.createRange();
      range.selectNodeContents(input);

      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);

      (<any>input).setSelectionRange(0, 999999);
      input.contentEditable = editable;
      (<any>input).readOnly = readOnly;

    } else {
      (<any>input).select();
    }
    document.execCommand('copy');
    $('#copyboard').remove();

  }

  getCardSortTestData(object) {
    const header = new Headers({ Authorization: 'Bearer ' + (JSON.parse(localStorage.getItem('currentUser'))).token});
    const httpOptions = {
        headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: 'Bearer ' + (JSON.parse(localStorage.getItem('currentUser'))).token
      })
  };
  //http://localhost:48792
    return this.http.post(this.userService.serverUrl + '/users/card-sort-test/getbyuserid', object, httpOptions);
  }

  getLink(id) {
    return this.baseurl + "/#/card-sort-test/" + id;
  }

  launchCardSortTest(studyId, preview?) {
    const data = {
      id: studyId,
      launched: true
  };
    this.editCardSortTest(data)
    .subscribe(
      res => {
        this.getAllCardSortTests();
        if (preview) {
          this.router.navigate(['card-sort-test/' + studyId]);
        }
      },
      err => {
        alert('An error occured. Please try again later.');
      }
    );
  }

  stopCardSortTest(studyId) {
    const data = {
      id: studyId,
      launched: false
    };
    this.editCardSortTest(data)
    .subscribe(
      res => {
        this.getAllCardSortTests();
      },
      err => {
        alert('An error occured. Please try again later.');
      }
    );
  }

  prepareDeleteStudy() {
    this.deleteStudy()
    .subscribe(
      res => {
        this.getAllCardSortTests();
        $("#myModal").modal('hide');
      },
      err => {
        $("#myModal").modal('hide');
        alert('An error occured. Please try again later.');
      }
    );
  }

  deleteStudy() {
    const header = new Headers({ Authorization: 'Bearer ' + (JSON.parse(localStorage.getItem('currentUser'))).token});
    const httpOptions = {
        headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: 'Bearer ' + (JSON.parse(localStorage.getItem('currentUser'))).token
      })
  };
  //http://localhost:48792
    return this.http.post(this.userService.serverUrl + '/users/card-sort-test/delete', {id: this.deleteCardSortTestId}, httpOptions);
  }

  editCardSortTest(data) {
    const header = new Headers({ Authorization: 'Bearer ' + (JSON.parse(localStorage.getItem('currentUser'))).token});
    const httpOptions = {
        headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: 'Bearer ' + (JSON.parse(localStorage.getItem('currentUser'))).token
      })
  };
  //http://localhost:48792
    return this.http.post(this.userService.serverUrl + '/users/card-sort-test/edit', data, httpOptions);
  }

}
