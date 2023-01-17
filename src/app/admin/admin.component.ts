import { Component, OnInit } from '@angular/core';

import { User, UserService } from '../user.service';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

declare var $: any;

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css', '../app.component.css']
})
export class AdminComponent implements OnInit {

  public users: Array<User>;

  public deleteUserId: string;

  public username = '';

  public password = '';

  public userid: string;

  constructor(private userService: UserService) { }

  ngOnInit() {
    $('[data-toggle="tooltip"]').tooltip();
    this.userService.getAll().subscribe(res => this.users = res);
  }

  prepareDeleteUser() {
    this.userService
      .delete(this.deleteUserId)
      .subscribe(
        res => {
          this.userService.getAll().subscribe(res => this.users = res);
          $("#myModal2").modal('hide');
        },
        err => {
          $("#myModal2").modal('hide');
          alert('An error occured. Please try again later.');
        }
      );
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
                  }
                );
          },
          error => {
              alert("Adding user failed!");
              $("#myModal3").modal('hide');
          });
  }

  changePassword() {
    const userObj: User = { 
      id: this.userid, 
      email: this.deleteUserId, 
      password: this.password
    };
    this.userService.update(userObj)
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
                }
              );
          },
          error => {
              alert("Changing password failed!");
              $("#myModal4").modal('hide');
          });
  }

  studyAccess(value: boolean, userId: string) {
    this.userid = userId;
    const userObj: User = {
      id: userId,
      study: value
    };
    this.userService.update(userObj)
      .subscribe(
        data => {
          this.userService.getAll()
            .subscribe(res => {
              if (value) {
                alert("Account enabled!");
              }
              else {
                alert("Account disabled!");
              }
              this.users = res;
            });
        },
        error => {
          alert("Changing study access failed!");
        });
  }

}
