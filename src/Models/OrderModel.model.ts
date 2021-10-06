import {OrderStatusInterface, OrderStatusModel} from './OrderStatus.model';
import {PersonalInformationInterface, PersonalInformationModel} from './PersonalInformationModel';
import {TicketOrderInterface, TicketOrderModel} from './TicketOrder.model';
import * as Parse from 'parse';
import {AddressModel} from "./Address.model";
import {TicketTypeInterface, TicketTypeModel} from "./TicketType.model";
import {TicketWebInterface} from "./EventsModel.model";

export class OrderModel {

  static async getOrder(id: string): Promise<Parse.Object | Parse.Error> {
    return await new Parse.Query(Parse.Object.extend('Orders')).get(id);
  }

  static async getAllOrders(): Promise<OrderInterface[]> {
    return await new Parse.Query(Parse.Object.extend('Orders')).find().then(
      value => {
        return this.toMultipleOrders(value);
      }, reason => {
        return reason;
      }
    );
  }

  static async addOrderToEvent(order: OrderInterface, eventID: string, selectedTicketTypeId: string, isSingle: boolean) {
    const orderObject = new (Parse.Object.extend('Order'))();
    const buyerInfoObject = await PersonalInformationModel.toParse(order.buyerInfo);
    orderObject.set('buyerInfo', buyerInfoObject);
    orderObject.set('event', Parse.Object.extend('Event').createWithoutData(eventID));
    if (isSingle) {
      const ticketStatusId = (await new Parse.Query(Parse.Object.extend('TicketStatus')).equalTo('statusName', 'Registered').first() as Parse.Object).id;
      orderObject.relation('orderedTickets').add(await TicketTypeModel
        .toParse(ticketStatusId,
          selectedTicketTypeId,
          buyerInfoObject));
    } else {
      const ticketStatusId = (await new Parse.Query(Parse.Object.extend('TicketStatus')).equalTo('statusName', 'Registered').first() as Parse.Object).id;
      for (const ticket of order.orderedTickets) {
        orderObject.relation('orderedTickets').add(await TicketTypeModel
          .toParse(ticketStatusId,
            selectedTicketTypeId,
            await PersonalInformationModel.toParse(ticket.attendeeInfo)));
      }
    }
    // Todo: save all orderedTicketObjects
    orderObject.set('status', Parse.Object.extend('OrderStatus').createWithoutData(order.status.id!));

    return new Parse.Query('Event').get(eventID).then(async value => {
      value.relation('orders').add(await orderObject.save());
      return await value.save();
    })
  }

  static toMultipleOrders(parseObjects: Parse.Object[]): OrderInterface[] {
    const orders: OrderInterface[] = [];
    parseObjects.forEach(parseObject => {
      orders.push(this.toOrder(parseObject));
    });
    return orders;
  }

  private static toOrder(parseObject: Parse.Object): OrderInterface {
    return {
      buyerInfo: PersonalInformationModel.toInfo(parseObject.get('orderedTickets')),
      completionDate: parseObject.get('completionDate') ? parseObject.get('completionDate') : undefined,
      createdAt: parseObject.createdAt,
      id: parseObject.id,
      orderedTickets: [],
      status: OrderStatusModel.toStatus(parseObject.get('status')),
      updatedAt: parseObject.updatedAt
    };
  }

  static search(data: OrderInterface, filter: string) {
    let attendeeMatch = false;
    data.orderedTickets.forEach(attendee => {
      if (TicketOrderModel.search(attendee, filter))
        attendeeMatch = true;
    })
    return attendeeMatch || PersonalInformationModel.search(data.buyerInfo, filter);
  }

  static async edit(editingAttendee: OrderInterface, selectedTicketTypeId: string) {
    const orderObject = await new Parse.Query(Parse.Object.extend('Order'))
      .include('buyerInfo')
      .get(editingAttendee.id!);
    await PersonalInformationModel.toParse(editingAttendee.buyerInfo);
    // Todo: save all orderedTicketObjects
    orderObject.set('status', Parse.Object.extend('OrderStatus').createWithoutData(selectedTicketTypeId));
    await orderObject.save();
  }

  static async deleteOrder(order: OrderInterface, eventId: string) {
    const event = await new Parse.Query(Parse.Object.extend('Event')).get(eventId);
    event.relation('orders').remove(Parse.Object.extend('Order').createWithoutData(order.id!))
    await event.save();
  }

  static async purchase(ticketsBought: {ticketType:TicketWebInterface, attendeeInfo:PersonalInformationInterface}[],
                        contactInfo: PersonalInformationInterface,  eventId:string) {
    return await Parse.Cloud.run("purchaseTickets", {eventId, contactInfo, ticketsBought})
  }
  static async toParse(statusId: string, selectedTicketTypeId: string, attendeeInfo: PersonalInformationInterface) {
    const orderedTicketObject = new (Parse.Object.extend('TicketOrder'))();
    orderedTicketObject.set('attendeeInfo', attendeeInfo);
    return await orderedTicketObject.save();
  }
}


export interface OrderInterface {
  id?: string;
  updatedAt?: Date;
  createdAt?: Date;
  status: OrderStatusInterface;
  completionDate?: Date;
  buyerInfo: PersonalInformationInterface;
  orderedTickets: TicketOrderInterface[];
}
