import * as Parse from 'parse';

export class TicketStatusModel {

  static toStatus(parseObject: Parse.Object): TicketStatusInterface {
    return {
      id: parseObject.id,
      createdAt: parseObject.createdAt,
      updatedAt: parseObject.updatedAt,
      status: this.getEnumKeyByEnumValue(parseObject.get('statusName'))
    };
  }
  static toMultipleStatus(parseObjects: Parse.Object[]): TicketStatusInterface[] {
    const ticketStatuses: TicketStatusInterface[] = [];
    parseObjects.forEach(parseObject=>{
      ticketStatuses.push(this.toStatus(parseObject));
    });
    return ticketStatuses;
  }

  static async getAllTicketStatus() {
    return this.toMultipleStatus(await new Parse.Query(Parse.Object.extend('TicketStatus')).find());
  }
  static getEnumKeyByEnumValue(enumValue: number | string): TicketStatusEnum {
    // @ts-ignore
    let keys = Object.keys(TicketStatusEnum).filter((x) => TicketStatusEnum[x] == enumValue);
    // @ts-ignore
    return TicketStatusEnum[keys.length > 0 ? keys[0] : ''];
  }
}

export interface TicketStatusInterface {
  id?: string;
  updatedAt?: Date;
  createdAt?: Date;
  status: TicketStatusEnum;
}

export enum TicketStatusEnum {
  checkedIn = 'Checked In',
  pending = 'Pending',
  preregistered = 'Preregistered',
  registered = 'Registered'
}
