import { Component, OnInit } from '@angular/core';

import { IUpdateUserAccount, IUserAccount, User, UserService } from '../user.service';

declare var $: any;

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css', '../app.component.css']
})
export class AdminComponent implements OnInit {

  public users: Array<IUserAccount>;

  public deleteUserId: string;

  public username = '';

  public password = '';

  public userid: string;

  constructor(private userService: UserService) { }

  ngOnInit() {
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
    const userObj: IUpdateUserAccount = {
      id: this.userid,
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
    const userObj: IUpdateUserAccount = {
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
