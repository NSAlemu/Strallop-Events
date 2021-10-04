import * as Parse from 'parse';
import {TicketStatusEnum, TicketStatusInterface} from "./TicketStatus.model";

export class EventStatusModel {

static getInitialStatus(): EventStatusInterface{
  return {
    createdAt: new Date(), id: 'EmYDmFsx5S', status: EventStatusEnum.unpublished, updatedAt: new Date()
  };
}
  static toStatus(parseObject: Parse.Object): EventStatusInterface {
    return {
      id: parseObject.id,
      updatedAt: parseObject.updatedAt,
      createdAt: parseObject.createdAt,
      status:  this.getEnumKeyByEnumValue(parseObject.get('statusName')),
    };
  }
  static async getAllEventStatus() {
    return this.toMultipleStatus(await new Parse.Query(Parse.Object.extend('EventStatus')).find());
  }
  static getEnumKeyByEnumValue(enumValue: number | string): EventStatusEnum {
    // @ts-ignore
    let keys = Object.keys(EventStatusEnum).filter((x) => EventStatusEnum[x] == enumValue);
    // @ts-ignore
    return EventStatusEnum[keys.length > 0 ? keys[0] : ''];
  }

  static toMultipleStatus(parseObjects: Parse.Object[]): EventStatusInterface[] {
    const ticketStatuses: EventStatusInterface[] = [];
    parseObjects.forEach(parseObject=>{
      ticketStatuses.push(this.toStatus(parseObject));
    });
    return ticketStatuses;
  }
}

export interface EventStatusInterface {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  status: EventStatusEnum;
}

export enum EventStatusEnum {
  cancelled = 'Cancelled',
  ended = 'Ended',
  started = 'Started',
  onSale = 'On Sale',
  published = 'Published',
  unpublished = 'Unpublished'
}
