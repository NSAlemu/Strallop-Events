import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

export class DialogData {
  id: string;
  header?: string;
  message: string;
  subMessage?: string;
  input?: string;

  constructor(id: string, message: string, header?: string, subMessage?: string, input?:string) {
    this.id = id;
    this.header = header;
    this.message = message;
    this.subMessage = subMessage;
    this.input = input;
  }
}

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
