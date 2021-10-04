import * as Parse from 'parse';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {EventInterface} from '../EventsModel.model';
import {EventStatusEnum, EventStatusInterface} from '../EventStatus.model';
import {TicketTypeInterface} from '../TicketType.model';
import {AddressInterface} from '../Address.model';
import {OrderInterface, OrderModel} from '../OrderModel.model';
import {PersonalInformationInterface} from '../PersonalInformationModel';
import {OrderStatusEnum, OrderStatusInterface, OrderStatusModel} from '../OrderStatus.model';
import {TicketOrderInterface} from '../TicketOrder.model';
import {TicketStatusEnum, TicketStatusInterface} from '../TicketStatus.model';
import {serverLocation} from "../../app/Util/shared";
import {EmailModel} from "../Email.model";

const qlQuery = {
  operationName: 'FindObject',
  variables: {},
  query: 'query FindObject {\n  orders(where: {event: {have: {objectId: {equalTo: "nOa1FSO8os"}}}}) {\n    count\n    edges {\n      node {\n        objectId\n        createdAt\n        updatedAt\n        completionDate\n        orderedTickets {\n          count\n          edges {\n            node {\n              objectId\n              createdAt\n              updatedAt\n              status {\n                objectId\n                createdAt\n                updatedAt\n                statusName\n              }\n              attendeeInfo {\n                objectId\n                createdAt\n                updatedAt\n                address {\n                  objectId\n                  createdAt\n                  updatedAt\n                  address1\n                  address2\n                  city\n                  country\n                  geoLocation {\n                    latitude\n                    longitude\n                  }\n                }\n                firstName\n              middleName\n                LastName\n                email\n                phoneNumber\n                organization\n              }\n              ticketType {\n                id\n                createdAt\n                updatedAt\n                name\n                price\n                capacity\n                salesStartDate\n                salesEndDate\n              }\n            }\n          }\n        }\n        status {\n          objectId\n          createdAt\n          updatedAt\n          statusname\n        }\n        buyerInfo {\n          objectId\n          createdAt\n          updatedAt\n          address {\n            objectId\n            createdAt\n            updatedAt\n            address1\n            address2\n            city\n            country\n            geoLocation {\n              latitude\n              longitude\n            }\n          }\n          firstName\n         middleName\n           LastName\n          email\n          phoneNumber\n          organization\n        }\n        event {\n          id\n          createdAt\n          updatedAt\n          name\n          description\n          locationName\n          startDate\n          endDate\n          isOnline\n          ticketTypes {\n            count\n            edges {\n              node {\n                id\n                createdAt\n                updatedAt\n                name\n                price\n                capacity\n                salesStartDate\n                salesEndDate\n              }\n            }\n          }\n          status {\n            objectId\n            createdAt\n            updatedAt\n            statusName\n          }\n          address {\n            objectId\n            createdAt\n            updatedAt\n            address1\n            address2\n            city\n            country\n            geoLocation {\n              latitude\n              longitude\n            }\n          }\n        }\n      }\n    }\n  }\n}\n'
};

export class OrderGraphQLModel {
  static async getAllEventOrders(http: HttpClient): Promise<OrderInterface[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Parse-Application-Id': 'APPLICATION_ID',
      })
    };
    return await http.post(serverLocation + '/graph', qlQuery, httpOptions)
      .toPromise().then(value => {
        // @ts-ignore
        return this.toOrderList(value.data.events.edges);
      });
  }

  private static toOrderList(data: any): OrderInterface[] {
    const orderList: OrderInterface[] = [];
    // @ts-ignore
    data.forEach(event => {
      orderList.push(this.toOrder(event.node));
    });
    return orderList;
  }

  private static toOrder(data: any): OrderInterface {
    return {
      buyerInfo: OrderGraphQLModel.toInfo(data.buyerInfo),
      completionDate: data.completionDate,
      createdAt: data.createdAt,
      id: data.objectId,
      orderedTickets: OrderGraphQLModel.toOrderedTicketsList(data.orderedTickets),
      status: OrderGraphQLModel.toOrderStatus(data.status),
      updatedAt: data.updatedAt
    };
  }

  private static toOrderedTicketsList(orderedTickets: any): TicketOrderInterface[] {
    const ticketOrderlist: TicketOrderInterface[] = [];
    // @ts-ignore
    data.forEach(event => {
      ticketOrderlist.push(this.toOrderedTicket(event.node));
    });
    return ticketOrderlist;
  }

  private static toOrderStatus(data: any): OrderStatusInterface {
    return {
      createdAt: data.createdAt,
      id: data.objectId,
      status: OrderStatusModel.getEnumKeyByEnumValue(data.statusname),
      updatedAt: data.updatedAt
    };
  }

  private static toInfo(data: any): PersonalInformationInterface {
    return {
      middleName: data.middleName ?  data.middleName: "",
      address: this.toAddress(data.address),
      createdAt: data.createdAt,
      email: data.email,
      firstName: data.firstName,
      id: data.objectId,
      lastName: data.LastName,
      organization: data.organization,
      phoneNumber: data.phoneNumber,
      updatedAt: data.updatedAt

    };
  }

  private static toEvent(data: any): EventInterface {
    return {
      confirmationEmail: EmailModel.toWebEmail(undefined), isPrivate: false, reminderEmail:  EmailModel.toWebEmail(undefined),
      coverImage: "", isDraft: true, orders: [],
      address: this.toAddress(data.address),
      createdAt: data.createdAt,
      description: data.description,
      endDate: data.endDate,
      id: data.objectId,
      isOnline: false,
      name: data.name,
      startDate: data.startDate,
      status: this.toEventStatus(data.status),
      tickets: this.toTicketTypeList(data.ticketTypes.edges),
      updatedAt: data.updatedAt

    };
  }

  private static toTicketTypeList(data: any): TicketTypeInterface[] {
    const ticketTypeList: TicketTypeInterface[] = [];
    // @ts-ignore
    data.forEach(event => {
      ticketTypeList.push(this.toTicketType(event.node));
    });
    return ticketTypeList;
  }

  private static toEventStatus(data: any): EventStatusInterface {
    return {
      createdAt: data.createdAt,
      id: data.objectId,
      status: EventStatusEnum[data.statusName as keyof typeof EventStatusEnum],
      updatedAt: data.updatedAt
    };
  }

  private static toTicketType(data: any): TicketTypeInterface {
    return {
      createdAt: data.createdAt,
      id: data.objectId,
      updatedAt: data.updatedAt,
      capacity: data.capacity,
      name: data.name,
      price: data.price,
      salesEndDate: data.salesEndDate,
      salesStartDate: data.salesStartDate,
    };
  }


  private static toAddress(data: any): AddressInterface {
    return {
      name: data.name,
      address1: data.address1,
      address2: data.address2,
      city: data.city,
      country: data.country,
      createdAt: data.createdAt,
      geoLocation: new Parse.GeoPoint({latitude: data.geoLocation.latitude, longitude: data.geoLocation.longitude}),
      id: data.objectId,
      updatedAt: data.updatedAt,
    };
  }

  private static toOrderedTicket(data: any): TicketOrderInterface {
    return {
      attendeeInfo: this.toInfo(data.attendeeInfo),
      createdAt: data.createdAt,
      id: data.objectId,
      status: OrderGraphQLModel.toTicketStatus(data.status),
      ticketType: this.toTicketType(data.ticketType),
      updatedAt: data.updatedAt

    };
  }

  private static toTicketStatus(data: any): TicketStatusInterface {
    return {
      createdAt: data.createdAt,
      id: data.objectId,
      status: TicketStatusEnum[data.statusName as keyof typeof TicketStatusEnum],
      updatedAt: data.updatedAt
    };
  }
}
