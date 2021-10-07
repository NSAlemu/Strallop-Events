import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DialogData} from "../confirm-dialog/confirm-dialog.component";

@Component({
  selector: 'app-email-sent-dialog',
  templateUrl: './email-sent-dialog.component.html',
  styleUrls: ['./email-sent-dialog.component.css']
})
export class EmailSentDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<EmailSentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
