import {ApplicationRef, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import * as Parse from "parse";
import {EventInterface, EventModel, EventWebInterface, TicketWebInterface} from "../../../Models/EventsModel.model";
import {ErrorCatcher} from "../../Util/shared";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {PersonalInformationInterface} from "../../../Models/PersonalInformationModel";
import {NgForm} from "@angular/forms";
import {OrderModel} from "../../../Models/OrderModel.model";
import {AddressInterface} from "../../../Models/Address.model";
import {TicketTypeInterface} from "../../../Models/TicketType.model";

@Component({
  selector: 'app-event-registration',
  templateUrl: './event-registration.component.html',
  styleUrls: ['./event-registration.component.css']
})
export class EventRegistrationComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { event: EventWebInterface }, private appRef: ApplicationRef) {
  }

  ticketMap = new Map<string, number>();
  panelOpenState = false;
  currentStep: RegistrationStepSelection = RegistrationStepSelection.tickets;
  contactInfo: PersonalInformationInterface = {
    address: {
      address1: '', address2: '', name: '', city: '', country: '',
    }, email: "", firstName: "", lastName: "", middleName: "", organization: "", phoneNumber: ""
  }
  ticketsBought: { ticketType:TicketWebInterface, attendeeInfo: PersonalInformationInterface }[] = []
  @ViewChild('contactForm') input!: NgForm;
  loading=false;
  completed=true;

  ngOnInit(): void {
    this.data.event.tickets.forEach(ticket => {
      this.ticketMap.set(ticket.id, 0)
    })
  }

  counter(i: number) {
    return new Array(i + 1);
  }

  register() {
  }

  getTicketMap(id: string): number {
    return this.ticketMap.get(id)!;
  }

  getTotalTicketPrice() {
    let total = 0;
    this.data.event.tickets.forEach(ticket => {
      total += ticket.price * (this.ticketMap.get(ticket.id)!)
    })
    return total
  }

  getTotalNumberOfTickets() {
    let total = 0;
    this.data.event.tickets.forEach(ticket => {
      total += (this.ticketMap.get(ticket.id)!)
    })
    return total
  }

  setBoughtTickets() {
    this.ticketsBought.splice(0, this.ticketsBought.length);
    this.data.event.tickets.forEach(ticket => {
      for (let i = 0; i < this.ticketMap.get(ticket.id!)!; i++) {
        this.ticketsBought.push({
          ticketType: ticket,
          attendeeInfo: {
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            organization: '',
            middleName: '',
            address: {
              name: '',
              address1: '',
              address2: '',
              city: '',
              country: '',
            }
          }
        })
      }
    })
  }

  getAllRegistrationStepSelection(): typeof RegistrationStepSelection {
    return RegistrationStepSelection;
  }

  setStep() {
    switch (this.currentStep) {
      case RegistrationStepSelection.tickets:
        this.currentStep = RegistrationStepSelection.registration
        this.setBoughtTickets();
        break;
      case RegistrationStepSelection.registration:
        if (this.input.valid)
          this.currentStep = RegistrationStepSelection.purchase
        else
          Object.keys(this.input.controls).forEach(key => {
            this.input.controls[key].markAsDirty();
            this.input.controls[key].markAllAsTouched();
          });
        if (this.getTotalTicketPrice() <= 0) {
          this.purchaseTickets();
        }
        console.log(this.ticketsBought)
        break;
      case RegistrationStepSelection.purchase:
        this.currentStep = RegistrationStepSelection.tickets
        this.purchaseTickets();
        break;
    }
  }

  purchaseTickets() {
    OrderModel.purchase(this.ticketsBought, this.contactInfo, this.data.event.id);
  }

  requireEachUser() {
    let require = false;
    this.ticketsBought.forEach(ticket => {
      if (ticket.ticketType.requireAttendeeInfo) {
        require = true;
      }
    })
    if(!require){
      this.ticketsBought.forEach(ticket => {
        ticket.attendeeInfo = this.contactInfo;
      })
    }
    return require;
  }
}

enum RegistrationStepSelection {
  tickets, registration, purchase, completed
}
