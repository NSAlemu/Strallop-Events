import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FormGroup} from '@angular/forms';
import * as Parse from 'parse';
import {Title} from "@angular/platform-browser";
import {AlertSnackBar} from "../../Util/shared";
import {UserModel} from "../../../Models/User.model";

@Component({
  selector: 'app-login-component',
  templateUrl: './login-component.component.html',
  styleUrls: ['./login-component.component.css']
})
export class LoginComponentComponent implements OnInit {
  username = '';
  password = '';
  loading = false;

  constructor(private titleService: Title, private router: Router, private snackBar: MatSnackBar) {
    this.titleService.setTitle('Login');
  }

  ngOnInit(): void {
    if (Parse.User.current()) {
      this.router.navigateByUrl('/');
    }
  }

  async login() {
    this.loading = true;
    await UserModel.login(this.username, this.password).then(
      value => {
        this.username = '';
        this.password = '';
        this.router.navigateByUrl('/');
      }, reason => {
        this.username = '';
        this.password = '';
        AlertSnackBar(this.snackBar, false, reason.message);
      }
    );
    this.loading = false;
  }


}
