import { Component, OnInit } from '@angular/core';
import {Title} from "@angular/platform-browser";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-register-tickets',
  templateUrl: './register-tickets.component.html',
  styleUrls: ['./register-tickets.component.css']
})
export class RegisterTicketsComponent implements OnInit {
  eventId = '';

  constructor( private titleService: Title, private route: ActivatedRoute,
               private router: Router) {
    this.eventId = this.route.snapshot.paramMap.get('eventId')!;
  }

  async ngOnInit() {
    this.titleService.setTitle("Get Tickets");
  }


}
