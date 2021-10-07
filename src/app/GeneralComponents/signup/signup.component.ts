import {Component, OnInit} from '@angular/core';
import {UserModel} from "../../../Models/User.model";
import {AlertSnackBar} from "../../Util/shared";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  loading = false;

  constructor(private snackBar: MatSnackBar, private router: Router) {
  }

  ngOnInit(): void {
  }

  signup() {
    this.loading = true;
    UserModel.signUpUser({
      access: {name: '', displayName: '', users: [], roles: []},
      confirmPassword: this.confirmPassword,
      email: this.email,
      name: "",
      password: this.password,
      username: this.username
    }).then(value => {
      AlertSnackBar(this.snackBar, false, "Welcome to Strallop!");
      this.router.navigateByUrl('/')
    }, reason => AlertSnackBar(this.snackBar, false, reason.message)).catch(reason => AlertSnackBar(this.snackBar, false, reason.message));
    this.loading = false
  }

}
