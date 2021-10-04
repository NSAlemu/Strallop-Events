import {ApplicationRef, ChangeDetectorRef, Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {EventInterface, EventWebInterface} from "../../../Models/EventsModel.model";
import {TicketTypeInterface} from "../../../Models/TicketType.model";

@Component({
  selector: 'app-event-ticket',
  templateUrl: './event-ticket.component.html',
  styleUrls: ['./event-ticket.component.css']
})
export class EventTicketComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { event: EventWebInterface }, private appRef: ApplicationRef) {
  }

  ticketMap = new Map<string, number>();
  panelOpenState=false;

  ngOnInit(): void {
    this.data.event.tickets.forEach(ticket => {
      this.ticketMap.set(ticket.id, 0)
    })
  }

  counter(i: number) {
    return new Array(i);
  }

  register() {
    console.log(this.ticketMap)
  }

  getTicketMap(id: string): number {
    return this.ticketMap.get(id)!;
  }

  getTotalTicket() {
    let total = 0;
    this.data.event.tickets.forEach(ticket => {
      total += ticket.price * (this.ticketMap.get(ticket.id)!)
    })
    return total
  }
}
