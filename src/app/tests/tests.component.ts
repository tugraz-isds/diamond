import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

import { UserService } from '../user.service';
import { AuthenticationService } from '../authentification.service';

import { Router, ActivatedRoute } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.css', '../app.component.css']
})
export class TestsComponent implements OnInit {
  tests;
  deleteTestId;
  baseurl = "";

  constructor(private http: HttpClient, private userService: UserService, public authService: AuthenticationService, private router: Router) { }

  ngOnInit() {
    $('[data-toggle="tooltip"]').tooltip();
    this.baseurl = location.origin;
    this.getAllTests();  
  }

  getAllTests() {
    const data = {
        user: JSON.parse(localStorage.getItem('currentUser')).email
    };
    console.log(data)
    this.getTestData(data)
    .subscribe(
      res => {
        this.tests = res;
      },
      err => {
      }
    );
  }

  copyToClipboard(studyId) {

    $('#copyboardtest').append('<textarea id="copyboard"></textarea>');
    $('#copyboard').val(this.baseurl + "/#/test/" + studyId);

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

  getTestData(object) {
    const header = new Headers({ Authorization: 'Bearer ' + (JSON.parse(localStorage.getItem('currentUser'))).token});
    const httpOptions = {
        headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: 'Bearer ' + (JSON.parse(localStorage.getItem('currentUser'))).token
      })
  };
  //http://localhost:48792
    return this.http.post(this.userService.serverUrl + '/users/test/getbyuserid', object, httpOptions);
  }

  getLink(id) {
    return this.baseurl + "/#/test/" + id;
  }

  launchTest(studyId, preview?) {
    const data = {
      id: studyId,
      launched: true
  };
    this.editTest(data)
    .subscribe(
      res => {
        this.getAllTests();
        if (preview) {
          this.router.navigate(['test/' + studyId]);
        }
      },
      err => {
        alert('An error occured. Please try again later.');
      }
    );
  }

  stopTest(studyId) {
    const data = {
      id: studyId,
      launched: false
    };
    this.editTest(data)
    .subscribe(
      res => {
        this.getAllTests();
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
        this.getAllTests();
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
    return this.http.post(this.userService.serverUrl + '/users/test/delete', {id: this.deleteTestId}, httpOptions);
  }

  editTest(data) {
    const header = new Headers({ Authorization: 'Bearer ' + (JSON.parse(localStorage.getItem('currentUser'))).token});
    const httpOptions = {
        headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: 'Bearer ' + (JSON.parse(localStorage.getItem('currentUser'))).token
      })
  };
  //http://localhost:48792
    return this.http.post(this.userService.serverUrl + '/users/test/edit', data, httpOptions);
  }

}
