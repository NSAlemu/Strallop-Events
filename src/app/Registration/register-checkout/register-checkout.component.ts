import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {EventInterface} from "../../../Models/EventsModel.model";

@Component({
  selector: 'app-register-checkout',
  templateUrl: './register-checkout.component.html',
  styleUrls: ['./register-checkout.component.css']
})
export class RegisterCheckoutComponent implements OnInit {


  constructor(@Inject(MAT_DIALOG_DATA) public data: {event:EventInterface}) { }

  ngOnInit(): void {
  }

  counter(i: number) {
    return new Array(i);
  }
}
