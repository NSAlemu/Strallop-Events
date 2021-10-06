import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {Title} from "@angular/platform-browser";
import * as Parse from "parse";
import {getEvents} from "../testingData";
import {MatDialog} from "@angular/material/dialog";
import {EventTicketComponent} from "../Registration/event-ticket/event-ticket.component";
import {EventRegistrationComponent} from "../Registration/event-registration/event-registration.component";
import {RegisterDetailsComponent} from "../Registration/register-details/register-details.component";
import {RegisterCheckoutComponent} from "../Registration/register-checkout/register-checkout.component";
import {EventInterface, EventModel, EventWebInterface} from "../../Models/EventsModel.model";
import {ErrorCatcher} from "../Util/shared";
import {tick} from "@angular/core/testing";
import {min} from "rxjs/operators";

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit {
  eventId = '';
  event!: EventWebInterface;
  time:{hour:string, min:string, sec: string} = {hour:'', min:'', sec: ''}
  interval:any;
  constructor( private titleService: Title, private route: ActivatedRoute,
              private router: Router, private httpClient: HttpClient,public dialog: MatDialog) {
    this.eventId = this.route.snapshot.paramMap.get('eventId')!;
  }

  async ngOnInit() {
    // await this.getEvent();
    await this.getEvent();
    if(!this.event)
    this.event = getEvents()[Math.floor(Math.random()*getEvents().length)]
    this.titleService.setTitle(this.event.name);
    this.interval = setInterval(value=>{
      const date = new Date();
      this.time.hour = date.getHours()>12?(date.getHours()-12) + '': date.getHours()+'';
      this.time.min = date.getMinutes()<10? '0'+date.getMinutes(): date.getMinutes()+'';
      this.time.sec = date.getSeconds()+'';
    },1000)
  }
  ngOnDestroy(){

  }
  async getEvent() {
    this.event = await EventModel.getWebEvent(this.eventId)
  }
  openTicketDialog() {
    const dialogRef = this.dialog.open(EventRegistrationComponent,{
      data: {
        event: this.event
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        console.log(result)
        this.openRegisterDialog();
      }
    });
  }
  openRegisterDialog() {
    const dialogRef = this.dialog.open(RegisterDetailsComponent,{
      data: {
        event: this.event
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.openCheckoutDialog();
      }
    });
  }
  openCheckoutDialog() {
    const dialogRef = this.dialog.open(RegisterCheckoutComponent,{
      data: {
        event: this.event
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){

      }
    });
  }

  getMinPrice() {
    let minPrice = Infinity;
    this.event.tickets.forEach(ticket=>{
      if(ticket.price<minPrice){
        minPrice = ticket.price;
      }
    })
    if(minPrice<=0){
      return 'Free'
    }
    return minPrice;
  }
  getMaxPrice() {
    let maxPrice = 0;
    this.event.tickets.forEach(ticket=>{
      if(ticket.price>maxPrice){
        maxPrice = ticket.price;
      }
    })
    return maxPrice;
  }
}
