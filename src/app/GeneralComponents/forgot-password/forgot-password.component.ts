import {Component, OnInit} from '@angular/core';
import {AlertSnackBar} from "../../Util/shared";
import {EmailSentDialogComponent} from "../../ReusableComponents/email-sent-dialog/email-sent-dialog.component";
import {UserModel} from "../../../Models/User.model";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  email = '';
  currentPassword = '';
  newPassword = '';

  constructor(private confirmDialog: MatDialog, private router: Router) {
  }

  ngOnInit(): void {
  }

  async resetPassword() {
    const dialogRefLoading = this.confirmDialog.open(EmailSentDialogComponent, {
      data: {
        loading: true,
        error: '',
        message: 'Password reset email sent to \"' + this.email + '\"?'
      }
    });

    let error = '';
    await UserModel.resetPassword(this.currentPassword, this.newPassword).then(value => {
      error = ''
    }, reason => error = reason.message).catch(reason => error = reason.message);
    dialogRefLoading.close();
    const dialogRefEmailSent = this.confirmDialog.open(EmailSentDialogComponent, {
      data: {loading: false, error, message: '\"' + this.email + '\"?'}
    });
    dialogRefEmailSent.afterClosed().subscribe(result => {
      this.router.navigateByUrl('/login')
    });
  }
}
