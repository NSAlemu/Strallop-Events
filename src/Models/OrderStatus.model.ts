import * as Parse from 'parse';
import {TicketStatusEnum, TicketStatusInterface} from "./TicketStatus.model";

export class OrderStatusModel {

  static toStatus(parseObject: Parse.Object): OrderStatusInterface {
    return {
      createdAt: parseObject.createdAt,
      id: parseObject.id,
      status: this.getEnumKeyByEnumValue(parseObject.get('statusname')),
      updatedAt: parseObject.updatedAt
    };
  }

  static getEnumKeyByEnumValue(enumValue: number | string): OrderStatusEnum {
    // @ts-ignore
    let keys = Object.keys(OrderStatusEnum).filter((x) => OrderStatusEnum[x] == enumValue);
    // @ts-ignore
    return OrderStatusEnum[keys.length > 0 ? keys[0] : ''];
  }

  static toMultipleStatus(parseObjects: Parse.Object[]): OrderStatusInterface[] {
    const ticketStatuses: OrderStatusInterface[] = [];
    parseObjects.forEach(parseObject => {
      ticketStatuses.push(this.toStatus(parseObject));
    });
    return ticketStatuses;
  }

  static async getAllOrderStatus() {
    return this.toMultipleStatus(await new Parse.Query(Parse.Object.extend('OrderStatus')).find());
  }
}

export interface OrderStatusInterface {
  id?: string;
  updatedAt?: Date;
  createdAt?: Date;
  status: OrderStatusEnum;
}

export enum OrderStatusEnum {
  preregistering = 'Preregistering',
  preordered = 'Preordered',
  pending = 'Pending',
  completed = 'Completed',
  cancelled = 'Cancelled'
}
