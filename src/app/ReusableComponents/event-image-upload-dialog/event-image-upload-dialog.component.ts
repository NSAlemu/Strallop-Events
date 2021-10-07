import {AfterViewInit, Component, Inject, ViewChild} from '@angular/core';
import {ImageCroppedEvent} from "ngx-image-cropper";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-event-image-upload-dialog',
  templateUrl: './event-image-upload-dialog.component.html',
  styleUrls: ['./event-image-upload-dialog.component.css']
})
export class EventImageUploadDialogComponent implements AfterViewInit {
  imageChangedEvent: any = '';
  croppedImage: any = '';
  @ViewChild('uploadInput') input:any;
  croppedFile: File|undefined;
  constructor(@Inject(MAT_DIALOG_DATA) public data: { background: string}) { }

  ngAfterViewInit(): void {
    this.input.nativeElement.click();
  }


  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.croppedFile=this.upload();
  }
  imageLoaded() {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }
  upload(){
    const blob = this.dataURItoBlob(this.croppedImage);
    return new File([blob], 'event_cover.png', { type: 'image/png' });
  }
  dataURItoBlob(dataURI:string) {
    console.log(dataURI)
    const byteString = window.atob(dataURI.split('base64,')[1]);
    console.log(dataURI.split('base64,')[1])

    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    return new Blob([int8Array], {type: 'image/png'});
  }

}
