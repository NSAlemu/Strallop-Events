import {Component, OnInit} from '@angular/core';
import {UserModel} from "../../../Models/User.model";
import {AlertSnackBar} from "../../Util/shared";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {EmailSentDialogComponent} from "../../ReusableComponents/email-sent-dialog/email-sent-dialog.component";

@Component({
  selector: 'app-setting-account-password',
  templateUrl: './setting-account-password.component.html',
  styleUrls: ['./setting-account-password.component.css']
})
export class SettingAccountPasswordComponent implements OnInit {
  currentPassword = '';
  newPassword = '';
  repeatPassword = '';

  constructor(private snackBar: MatSnackBar, private confirmDialog: MatDialog) {
  }

  ngOnInit(): void {
  }

  async resetPassword() {
    if (this.newPassword !== this.repeatPassword) {
      AlertSnackBar(this.snackBar, false, "Passwords Do Not Match")
      return;
    }
    const dialogRefLoading = this.confirmDialog.open(EmailSentDialogComponent, {
      data: {
        loading: true,
        error: '',
        message: 'Password reset email sent to \"' + UserModel.getCurrentUser().getEmail() + '\"?'
      }
    });

    let error = '';
    await UserModel.resetPassword(this.currentPassword, this.newPassword).then(value => {
      error = ''
    }, reason => error = reason.message).catch(reason => error = reason.message);
    dialogRefLoading.close();
    const dialogRefEmailSent = this.confirmDialog.open(EmailSentDialogComponent, {
      data: {loading: false, error, message: '\"' + UserModel.getCurrentUser().getEmail() + '\"?'}
    });

  }

}
