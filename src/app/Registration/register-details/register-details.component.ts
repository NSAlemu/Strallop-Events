import {Component, Inject, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {ActivatedRoute, Router} from "@angular/router";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {EventInterface} from "../../../Models/EventsModel.model";

@Component({
  selector: 'app-register-details',
  templateUrl: './register-details.component.html',
  styleUrls: ['./register-details.component.css']
})
export class RegisterDetailsComponent implements OnInit {


  constructor(@Inject(MAT_DIALOG_DATA) public data: {event:EventInterface}) { }

  ngOnInit(): void {
  }

  counter(i: number) {
    return new Array(i);
  }
}
