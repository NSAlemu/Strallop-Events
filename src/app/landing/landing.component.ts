import { Component, OnInit } from '@angular/core';
import {Title} from "@angular/platform-browser";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import * as Parse from "parse";
import {getEvents} from "../testingData";
import {EventInterface, EventModel, EventWebInterface} from "../../Models/EventsModel.model";

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  featuredEvents: EventWebInterface[] = []
  eventId = '';
  event!: EventInterface;
  time:{hour:string, min:string, sec: string} = {hour:'', min:'', sec: ''}
  constructor( private titleService: Title, private httpClient: HttpClient, private route: ActivatedRoute,
               private router: Router) {
    this.eventId = this.route.snapshot.paramMap.get('eventId')!;
  }

  async ngOnInit() {
    // await this.getEvent();
    setTimeout(() => {
    }, 4000);
    await EventModel.getFeaturedEvents().then(value => {
      // this.featuredEvents.splice(0,this.featuredEvents.length)
      this.featuredEvents.push(...value)
    });

  }

}
