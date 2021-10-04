import * as Parse from 'parse';
import {AddressInterface, AddressModel} from './Address.model';
import {EventStatusEnum, EventStatusInterface, EventStatusModel} from './EventStatus.model';
import {TicketTypeInterface, TicketTypeModel} from './TicketType.model';
import {EventsGraphQLModel} from './GraphQL/EventsGraphQL.model';
import {HttpClient} from '@angular/common/http';
import {OrderInterface} from './OrderModel.model';
import {BudgetInterface} from "./BudgetModel.model";
import {FileInterface} from "./FileModel.model";
import {EmailInterface, EmailModel} from "./Email.model";

export class EventModel {
  static search(data: EventInterface, filter: string) {
    return data.name.toLocaleLowerCase().includes(filter) || AddressModel.search(data.address, filter);
  }

  static async getFeaturedEvents(): Promise<EventWebInterface[]> {
    return this.toMultipleWebEvents(await Parse.Cloud.run("featuredEventsWeb"))
  }

  static async getWebEvent(eventId:string):Promise<EventWebInterface> {
    return this.toWebEvent(await Parse.Cloud.run("getEventWeb",{eventId}));
  }

  static toMultipleWebEvents(parseObjects: []): EventWebInterface[] {
    const events: EventWebInterface[] = [];
    parseObjects.forEach(event => {
      events.push(this.toWebEvent(event));
    })
    return events;
  }

  static toWebEvent(parseObject: any): EventWebInterface {
    return {
      coverImage: parseObject['coverImage'] ? parseObject['coverImage'] : '',
      address: parseObject['address'],
      description: parseObject['description'] ? parseObject['description'] : '',
      endDate: parseObject['endDate'] ? parseObject['endDate'] : new Date(),
      id: parseObject.id,
      name: parseObject['name'] ? parseObject['name'] : '',
      startDate: parseObject['startDate'] ? parseObject['startDate'] : new Date(),
      tickets: parseObject['tickets']
    };
  }
}

export interface EventInterface {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  startDate: Date;
  endDate: Date;
  description: string;
  isOnline: boolean;
  address: AddressInterface;
  tickets: TicketTypeInterface[];
  status: EventStatusInterface;
  orders: OrderInterface[];
  coverImage: string;
  coverImageFile?: File;
  isDraft: boolean;
  budget?: BudgetInterface[]
  documents?: FileInterface[];
  isPrivate: boolean,
  isPublishScheduled?: boolean;
  publishDate?: Date;
  confirmationEmail: EmailInterface;
  reminderEmail: EmailInterface;
}

export interface EventWebInterface {
  id: string,
  name: string,
  coverImage: string,
  startDate: Date,
  endDate: Date,
  address: AddressWebInterface,
  tickets: TicketWebInterface[],
  description: string
}
export interface AddressWebInterface{
  id: string,
  name: string,
  address1: string,
  address2: string,
  city: string,
  country: string,
}
export interface TicketWebInterface{
  id:  string,
  name: string,
  price: number,
  capacity: number,
  sold:number,
  salesStartDate: Date,
  salesEndDate: Date
  attendeeLimitPerOrder:number,
  requireAttendeeInfo:boolean
}
