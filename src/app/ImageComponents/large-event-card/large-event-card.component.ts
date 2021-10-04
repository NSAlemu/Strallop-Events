import {Component, Input, OnInit} from '@angular/core';
import {EventInterface, EventWebInterface} from "../../../Models/EventsModel.model";

@Component({
  selector: 'app-large-event-card',
  templateUrl: './large-event-card.component.html',
  styleUrls: ['./large-event-card.component.css']
})
export class LargeEventCardComponent implements OnInit {
  @Input() carouselItem!: EventWebInterface;
  constructor() { }

  ngOnInit(): void {
  }

}
