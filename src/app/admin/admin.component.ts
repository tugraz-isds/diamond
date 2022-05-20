import { Component, OnInit } from '@angular/core';

import { UserService } from '../user.service';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

declare var $: any;

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css', '../app.component.css']
})
export class AdminComponent implements OnInit {
  users;
  deleteUserId;

  username = "";
  password = "";
  userid;
  constructor(private userService: UserService, private http: HttpClient) { }

  ngOnInit() {
    $('[data-toggle="tooltip"]').tooltip();
    this.userService.getAll()
        .subscribe(
          res => {
            this.users = res;
          },
          err => {
          }
        );
  }

  prepareDeleteUser() {
    this.deleteUser()
    .subscribe(
      res => {
        this.userService.getAll()
        .subscribe(
          res => {
            this.users = res;
          },
          err => {
          }
        );
        $("#myModal2").modal('hide');
      },
      err => {
        $("#myModal2").modal('hide');
        alert('An error occured. Please try again later.');
      }
    );
  }

  deleteUser() {
    const header = new Headers({ Authorization: 'Bearer ' + (JSON.parse(localStorage.getItem('currentUser'))).token});
    const httpOptions = {
        headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: 'Bearer ' + (JSON.parse(localStorage.getItem('currentUser'))).token
      })
  };
  //http://localhost:48792
    return this.http.post(this.userService.serverUrl + '/users/' + this.deleteUserId, {id: this.deleteUserId}, httpOptions);
  }

  addUser() {
    this.userService.register({"email": this.username, "password": this.password})
      .subscribe(
          data => {
              this.userService.getAll()
                .subscribe(
                  res => {
                    this.users = res;
                    $("#myModal3").modal('hide');
                  },
                  err => {
                  }
                );
          },
          error => {
              alert("Adding user failed!");
              $("#myModal3").modal('hide');
          });
  }

  changePassword() {
    this.userService.update({"userid": this.userid, "email": this.deleteUserId, "password": this.password})
      .subscribe(
          data => {
              this.userService.getAll()
                .subscribe(
                  res => {
                    let lang = localStorage.getItem('tt-language');
                    if (lang === 'en')
                    alert("Successfully changed password!");
                    else 
                    alert("Passwort erfolgreich geändert!");
                    this.users = res;
                    $("#myModal4").modal('hide');
                  },
                  err => {
                  }
                );
          },
          error => {
              alert("Changing password failed!");
              $("#myModal4").modal('hide');
          });
  }

  studyAccess(value, userId) {
    this.userid = userId;
    this.userService.update({"userid": this.userid, "study": value})
      .subscribe(
          data => {
              this.userService.getAll()
                .subscribe(
                  res => {
                    if (value) {
                    alert("Account enabled!");
                    }
                    else {
                    alert("Account disabled!");
                    }
                    this.users = res;
                  },
                  err => {
                  }
                );
          },
          error => {
              alert("Changing study access failed!");
          });
  }

}
