import { Component, OnInit } from '@angular/core';
import {UserModel} from "../../../Models/User.model";

@Component({
  selector: 'app-setting-account-close',
  templateUrl: './setting-account-close.component.html',
  styleUrls: ['./setting-account-close.component.css']
})
export class SettingAccountCloseComponent implements OnInit {
  closeAccountConfirmation = '';
  confirmPassword = '';

  constructor() { }

  ngOnInit(): void {
  }

  closeAccount() {
    if(this.closeAccountConfirmation.toLocaleUpperCase() === "CLOSE ACCOUNT"){
      UserModel.closeAccount(this.confirmPassword)
    }
  }
}
