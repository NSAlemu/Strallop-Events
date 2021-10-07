import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {EventImageUploadDialogComponent} from "../event-image-upload-dialog/event-image-upload-dialog.component";

@Component({
  selector: 'app-event-image-upload',
  templateUrl: './event-image-upload.component.html',
  styleUrls: ['./event-image-upload.component.css']
})
export class EventImageUploadComponent implements OnInit {
  @Input() size!: number;
  @Input() input!: number;
  @Input() file: File | undefined;
  @Output() fileChange = new EventEmitter<File | undefined>();
  @Input() background: string = '';
  @Output() backgroundChange = new EventEmitter<string>();

  constructor(private dialog: MatDialog) {
  }

  ngOnInit(): void {

  }

  openDialog(): void {
    const dialogRef = this.dialog.open(EventImageUploadDialogComponent, {
      width: '900px',
      maxWidth: '90%',
      height: '600px',
      autoFocus: false,
      data: {
        background: this.background
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.background = result.base64
      this.file = result.file
      this.fileChange.emit(this.file);
    });
  }

  clearImage() {
    this.file = undefined;
    this.background = ''
    this.fileChange.emit(this.file);
    this.backgroundChange.emit('')
  }
}
