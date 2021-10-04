import * as Parse from 'parse';
import {TicketOrderInterface} from './TicketOrder.model';
import {PersonalInformationInterface} from "./PersonalInformationModel";

export class TicketTypeModel {

  static toTicketType(parseObject: Parse.Object): TicketTypeInterface {
    return {
      id: parseObject.id,
      createdAt: parseObject.createdAt,
      updatedAt: parseObject.updatedAt,
      capacity: parseObject.get('capacity'),
      name: parseObject.get('name'),
      price: parseObject.get('price'),
      salesEndDate: parseObject.get('salesEndDate'),
      salesStartDate: parseObject.get('salesStartDate'),
    };
  }

  static toMultipleTicketOrder(parseObjects: Parse.Object[]): TicketTypeInterface[] {
    const ticketOrder: TicketTypeInterface[] = [];
    parseObjects.forEach(parseObject => {
      ticketOrder.push(this.toTicketType(parseObject));
    });
    return ticketOrder;
  }

  static async saveTicketType(ticket: TicketTypeInterface, eventId: string) {
    let newTicket = new (Parse.Object.extend('TicketType'))();
    if (ticket.id) {
      newTicket = await new Parse.Query(Parse.Object.extend('TicketType')).get(ticket.id);
    }
    newTicket.set('name', ticket.name);
    newTicket.set('capacity', ticket.capacity);
    newTicket.set('price', ticket.price);
    newTicket.set('salesStartDate', new Date(ticket.salesStartDate));
    newTicket.set('salesEndDate', new Date(ticket.salesEndDate));
    newTicket.set('event', Parse.Object.extend('Event').createWithoutData(eventId));
    await newTicket.save();
    await new Parse.Query(Parse.Object.extend('Event')).include('ticketType').get(eventId).then(async value => {
      value.relation('ticketTypes').add(newTicket);
      await value.save();
    }, reason => console.log(reason.message)).catch(reason => console.log(reason.message));
  }

  static async removeTicketTypeFromEvent(eventId: string, id: string) {
    await new Parse.Query(Parse.Object.extend('Event')).include('ticketType').get(eventId).then(async value => {
      value.relation('ticketTypes').remove(Parse.Object.extend('TicketType').createWithoutData(id));
      await value.save();
    }, reason => console.log(reason.message)).catch(reason => console.log(reason.message));
  }

  static async toParse(statusId: string, selectedTicketTypeId: string, attendeeInfo: PersonalInformationInterface) {
    const orderedTicketObject = new (Parse.Object.extend('TicketOrder'))();
    orderedTicketObject.set('status', Parse.Object.extend('TicketStatus').createWithoutData(statusId));
    orderedTicketObject.set('ticketType', Parse.Object.extend('TicketType').createWithoutData(selectedTicketTypeId));
    orderedTicketObject.set('attendeeInfo', attendeeInfo);
    return await orderedTicketObject.save();
  }

  static search(data: TicketTypeInterface, filter: string): boolean {
    return data.name.toLocaleLowerCase().includes(filter);
  }

  static async getAllTicketType(eventId: string) {
    return await new Parse.Query(Parse.Object.extend('TicketType'))
      .equalTo('event', Parse.Object.extend('Event').createWithoutData(eventId))
      .find().then(async value => {
        return this.toMultipleTicketOrder(value);
      }, reason => console.log(reason.message)).catch(reason => console.log(reason.message));
  }

  static async restoreTicket(ticket: TicketTypeInterface, eventId: string) {
    await new Parse.Query(Parse.Object.extend('Event')).include('ticketType').get(eventId).then(async value => {
      value.relation('ticketTypes').add(Parse.Object.extend('TicketType').createWithoutData(ticket.id!));
      await value.save();
    }, reason => console.log(reason.message)).catch(reason => console.log(reason.message));
  }
}

export interface TicketTypeInterface {
  id?: string;
  updatedAt?: Date;
  createdAt?: Date;
  name: string;
  price: number;
  capacity: number;
  salesStartDate: Date;
  salesEndDate: Date;
}
