import * as Parse from 'parse';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {EventInterface} from '../EventsModel.model';
import {EventStatusEnum, EventStatusInterface, EventStatusModel} from '../EventStatus.model';
import {TicketTypeInterface} from '../TicketType.model';
import {AddressInterface} from '../Address.model';
import {OrderInterface} from '../OrderModel.model';
import {TicketOrderInterface} from '../TicketOrder.model';
import {OrderStatusEnum, OrderStatusInterface, OrderStatusModel} from '../OrderStatus.model';
import {PersonalInformationInterface} from '../PersonalInformationModel';
import {TicketStatusEnum, TicketStatusInterface, TicketStatusModel} from '../TicketStatus.model';
import {serverLocation} from "../../app/Util/shared";
import {BudgetInterface} from "../BudgetModel.model";
import {BudgetCheckListItemInterface} from "../BudgetChecklistItem.model";
import {FileInterface} from "../FileModel.model";
import {UserModel} from "../User.model";
import {EmailInterface} from "../Email.model";

const allEventsQuery = {
  "operationName": "FindAllEvent",
  "variables": {},
  "query": "query FindAllEvent {\n  events {\n    count\n    edges {\n      node {\n        objectId\n        createdAt\n        updatedAt\n        name\n        description\n        locationName\n        startDate\n        endDate\n        isDraft\n        isPrivate\n        publishDate\n        isPublishScheduled\n    coverImage {\n          url\n        }\n        isOnline\n        ticketTypes {\n          count\n          edges {\n            node {\n              objectId\n              createdAt\n              updatedAt\n              name\n              price\n              capacity\n              salesStartDate\n              salesEndDate\n            }\n          }\n        }\n        status {\n          objectId\n          createdAt\n          updatedAt\n          statusName\n        }\n        address {\n          objectId\n          createdAt\n          updatedAt\n          name\n          address1\n          address2\n          city\n          country\n          geoLocation {\n            latitude\n            longitude\n          }\n        }\n        orders {\n          count\n          edges {\n            node {\n              objectId\n              createdAt\n              updatedAt\n              completionDate\n              orderedTickets {\n                count\n                edges {\n                  node {\n                    objectId\n                    createdAt\n                    updatedAt\n                    status {\n                      objectId\n                      createdAt\n                      updatedAt\n                      statusName\n                    }\n                    attendeeInfo {\n                      objectId\n                      createdAt\n                      updatedAt\n                      address {\n                        objectId\n                        createdAt\n                        updatedAt\n                        name\n                        address1\n                        address2\n                        city\n                        country\n                        geoLocation {\n                          latitude\n                          longitude\n                        }\n                      }\n                      firstName\n                      middleName\n                      lastName\n                      email\n                      phoneNumber\n                      organization\n                    }\n                    ticketType {\n                      objectId\n                      createdAt\n                      updatedAt\n                      name\n                      price\n                      capacity\n                      salesStartDate\n                      salesEndDate\n                    }\n                  }\n                }\n              }\n              status {\n                objectId\n                createdAt\n                updatedAt\n                statusname\n              }\n              buyerInfo {\n                objectId\n                createdAt\n                updatedAt\n                address {\n                  objectId\n                  createdAt\n                  updatedAt\n                  name\n                  address1\n                  address2\n                  city\n                  country\n                  geoLocation {\n                    latitude\n                    longitude\n                  }\n                }\n                firstName\n                middleName\n                lastName\n                email\n                phoneNumber\n                organization\n              }\n              event {\n                objectId\n                createdAt\n                updatedAt\n                name\n                description\n                locationName\n                startDate\n                endDate\n                isOnline\n                ticketTypes {\n                  count\n                  edges {\n                    node {\n                      objectId\n                      createdAt\n                      updatedAt\n                      name\n                      price\n                      capacity\n                      salesStartDate\n                      salesEndDate\n                    }\n                  }\n                }\n                status {\n                  objectId\n                  createdAt\n                  updatedAt\n                  statusName\n                }\n                address {\n                  objectId\n                  createdAt\n                  updatedAt\n                  name\n                  address1\n                  address2\n                  city\n                  country\n                  geoLocation {\n                    latitude\n                    longitude\n                  }\n                }\n              }\n            }\n          }\n        }\n        documents {\n          count\n          edges {\n            node {\n              objectId\n              updatedAt\n              createdAt\n              name\n              file {\n                url\n                name\n              }\n              createdBy {\n                objectId\n                createdAt\n                updatedAt\n                name\n                username\n                profileImg {\n                  url\n                  name\n                }\n              }\n              updatedBy {\n                objectId\n                createdAt\n                updatedAt\n                name\n                username\n                profileImg {\n                  url\n                  name\n                }\n              }\n            }\n          }\n        }\n        budgets {\n          edges {\n            node {\n              objectId\n              createdAt\n              updatedAt\n              name\n              deadline\n              budget\n              checklist {\n                count\n                edges {\n                  node {\n                    objectId\n                    createdAt\n                    updatedAt\n                    description\n                    completed\n                    dueDate\n                    sortOrder\n                    isPositive\n                    notes\n                  }\n                }\n              }\n              category\n              source\n            }\n          }\n        }\n        confirmationEmail {\n          objectId\n          createdAt\n          updatedAt\n          html\n          text\n          sendDate\n          isScheduled\n          subject\n          event {\n            objectId\n          }\n          header {\n            url\n          }\n          body\n          recipients {\n            ... on Element {\n              value\n            }\n          }\n        }\n        reminderEmail {\n          objectId\n          createdAt\n          updatedAt\n          html\n          text\n          sendDate\n          isScheduled\n          subject\n          event {\n            objectId\n          }\n          header {\n            url\n          }\n          body\n          recipients {\n            ... on Element {\n              value\n            }\n          }\n        }\n      }\n    }\n  }\n}\n"
};

function eventByIdQuery(id: string) {
  return {
    "operationName": "FindEventById",
    "variables": {},
    "query": "query FindEventById {\n  event(id: \""+id+"\") {\n    objectId\n    createdAt\n    updatedAt\n    name\n    description\n    locationName\n    startDate\n    endDate\n    isDraft\n    isPrivate\n    isPublishScheduled\n    publishDate\n        coverImage {\n      url\n    }\n    isOnline\n    ticketTypes {\n      count\n      edges {\n        node {\n          objectId\n          createdAt\n          updatedAt\n          name\n          price\n          capacity\n          salesStartDate\n          salesEndDate\n        }\n      }\n    }\n    status {\n      objectId\n      createdAt\n      updatedAt\n      statusName\n    }\n    address {\n      objectId\n      createdAt\n      updatedAt\n      name\n      address1\n      address2\n      city\n      country\n      geoLocation {\n        latitude\n        longitude\n      }\n    }\n    orders {\n      count\n      edges {\n        node {\n          objectId\n          createdAt\n          updatedAt\n          completionDate\n          orderedTickets {\n            count\n            edges {\n              node {\n                objectId\n                createdAt\n                updatedAt\n                status {\n                  objectId\n                  createdAt\n                  updatedAt\n                  statusName\n                }\n                attendeeInfo {\n                  objectId\n                  createdAt\n                  updatedAt\n                  address {\n                    objectId\n                    createdAt\n                    updatedAt\n                    name\n                    address1\n                    address2\n                    city\n                    country\n                    geoLocation {\n                      latitude\n                      longitude\n                    }\n                  }\n                  firstName\n                  middleName\n                  lastName\n                  email\n                  phoneNumber\n                  organization\n                }\n                ticketType {\n                  objectId\n                  createdAt\n                  updatedAt\n                  name\n                  price\n                  capacity\n                  salesStartDate\n                  salesEndDate\n                }\n              }\n            }\n          }\n          status {\n            objectId\n            createdAt\n            updatedAt\n            statusname\n          }\n          buyerInfo {\n            objectId\n            createdAt\n            updatedAt\n            address {\n              objectId\n              createdAt\n              updatedAt\n              name\n              address1\n              address2\n              city\n              country\n              geoLocation {\n                latitude\n                longitude\n              }\n            }\n            firstName\n            middleName\n            lastName\n            email\n            phoneNumber\n            organization\n          }\n          event {\n            objectId\n            createdAt\n            updatedAt\n            name\n            description\n            locationName\n            startDate\n            endDate\n            isOnline\n            ticketTypes {\n              count\n              edges {\n                node {\n                  objectId\n                  createdAt\n                  updatedAt\n                  name\n                  price\n                  capacity\n                  salesStartDate\n                  salesEndDate\n                }\n              }\n            }\n            status {\n              objectId\n              createdAt\n              updatedAt\n              statusName\n            }\n            address {\n              objectId\n              createdAt\n              updatedAt\n              name\n              address1\n              address2\n              city\n              country\n              geoLocation {\n                latitude\n                longitude\n              }\n            }\n          }\n        }\n      }\n    }\n    documents {\n      count\n      edges {\n        node {\n          objectId\n          updatedAt\n          createdAt\n          name\n          file {\n            url\n            name\n          }\n          createdBy {\n            objectId\n            createdAt\n            updatedAt\n            name\n            username\n            profileImg {\n              url\n              name\n            }\n          }\n          updatedBy {\n            objectId\n            createdAt\n            updatedAt\n            name\n            username\n            profileImg {\n              url\n              name\n            }\n          }\n        }\n      }\n    }\n    budgets {\n      edges {\n        node {\n          objectId\n          createdAt\n          updatedAt\n          name\n          deadline\n          budget\n          checklist {\n            count\n            edges {\n              node {\n                objectId\n                createdAt\n                updatedAt\n                description\n                completed\n                dueDate\n                sortOrder\n                isPositive\n                notes\n              }\n            }\n          }\n          category\n          source\n        }\n      }\n    }\n    confirmationEmail {\n      objectId\n      createdAt\n      updatedAt\n      html\n      text\n      sendDate\n      subject\n      isScheduled\n      event {\n        objectId\n      }\n      header {\n        url\n      }\n      body\n      recipients {\n        ... on Element {\n          value\n        }\n      }\n    }\n    reminderEmail {\n      objectId\n      createdAt\n      updatedAt\n      html\n      text\n      sendDate\n      subject\n      isScheduled\n      event {\n        objectId\n      }\n      header {\n        url\n      }\n      body\n      footer\n      recipients {\n        ... on Element {\n          value\n        }\n      }\n    }\n  }\n}\n"
  }
}


export class EventsGraphQLModel {

  static async getAllEvents(http: HttpClient): Promise<EventInterface[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Parse-Application-Id': 'APPLICATION_ID',
        // @ts-ignore
        'X-Parse-Session-Token': Parse.User.current()?.getSessionToken()
      })
    };
    return await http.post(serverLocation + '/graphql', allEventsQuery, httpOptions)
      .toPromise().then(value => {
        // @ts-ignore
        return this.toEventList(value.data.events.edges);
      });
  }

  static async getEventByID(id: string, http: HttpClient): Promise<EventInterface | Parse.Error> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Parse-Application-Id': 'APPLICATION_ID',
        // @ts-ignore
        'X-Parse-Session-Token': Parse.User.current()?.getSessionToken()
      })
    };
    return await http.post(serverLocation + '/graphql', eventByIdQuery(id), httpOptions)
      .toPromise().then(value => {
        // @ts-ignore
        if (value.errors) {
          // @ts-ignore
          return new Parse.Error(value.errors[0].extensions.code, value.errors[0].message);
        }
        // @ts-ignore
        return this.toEvent(value.data.event);
      }, reason => {
        console.log(reason);
        return reason;
      });
  }


  private static toEventList(data: any): EventInterface[] {
    const eventlist: EventInterface[] = [];
    // @ts-ignore
    data.forEach(event => {
      eventlist.push(this.toEvent(event.node));
    });
    return eventlist;
  }

  private static toEvent(data: any): EventInterface {
    const event: EventInterface = {
      isPrivate: data.isPrivate,
      isPublishScheduled: data.isPublishScheduled? data.isPublishScheduled: false,
      publishDate: data.publishDate? data.publishDate: new Date(),
      coverImage: data.coverImage ? (data.coverImage.url as string).replace('graphq', 'parse') : '',
      isDraft: data.isDraft,
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
      orders: this.toOrderList(data.orders.edges),
      updatedAt: data.updatedAt,
      budget: this.toBudgetList(data.budgets.edges),
      documents: this.toDocumentList(data.documents.edges),
      confirmationEmail: this.toEmail(data.confirmationEmail),
      reminderEmail: this.toEmail(data.reminderEmail)
    };
    return event;
  }

  private static toDocumentList(documents: any): FileInterface[] {
    const fileList: FileInterface[] = []
    // @ts-ignore
    documents.forEach(file => {
      fileList.push(this.toDocument(file.node));
    });
    return fileList;
  }

  private static toDocument(node: any): FileInterface {
    const renamedFile = node.file ? (node.file.name as string).replace('graphq', 'parse') : '';
    const fileName = renamedFile.substring(renamedFile.indexOf('_') + 1, renamedFile.length) || renamedFile
    return {
      id: node.objectId,
      createdAt: node.createdAt,
      updatedAt: node.updatedAt,
      createdBy: this.toUserModel(node.createdBy),
      fileURL: node.file ? (node.file.url as string).replace('graphq', 'parse') : '',
      fileName: fileName,
      name: node.name,
      updatedBy: this.toUserModel(node.updatedBy)
    };
  }

  private static toUserModel(node: any): UserModel {
    return {
      createdAt: node.createdAt,
      email: "",
      id: node.objectId,
      name: node.name,
      updatedAt: node.updatedAt,
      profilePictureURL: node.profileImg ? (node.profileImg.url as string).replace('graphq', 'parse') : '',
      username: node.username
    }
  }

  private static toBudgetList(budgets: any): BudgetInterface[] {
    const budgetList: BudgetInterface[] = []
    // @ts-ignore
    budgets.forEach(budget => {
      budgetList.push(this.toBudget(budget.node));
    });
    return budgetList;
  }

  private static toBudget(node: any): BudgetInterface {
    return {
      id: node.objectId,
      createdAt: node.createdAt,
      updatedAt: node.updatedAt,
      budgeted: node.budget,
      category: node.category,
      deadline: node.deadline,
      name: node.name ? node.name : '',
      source: node.source ? node.source : '',
      vendor: node.vendor ? node.vendor : '',
      checklist: this.toBudgetChecklist(node.checklist.edges)
    };
  }

  private static toBudgetChecklist(edges: any) {
    const budgetChecklist: BudgetCheckListItemInterface[] = []
    // @ts-ignore
    edges.forEach(budget => {
      budgetChecklist.push(this.toBudgetChecklistItem(budget.node));
    });
    return budgetChecklist;
  }

  private static toBudgetChecklistItem(node: any): BudgetCheckListItemInterface {
    return {
      id: node.objectId,
      createdAt: node.createdAt,
      updatedAt: node.updatedAt,
      completed: node.completed,
      description: node.description ? node.description : "",
      position: node.sortOrder,
      isPositive: node.isPositive,
      notes: node.notes ? node.notes : ""
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
      status: EventStatusModel.getEnumKeyByEnumValue(data.statusName),
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
      address1: data.address1 ? data.address1 : '',
      address2: data.address2 ? data.address2 : '',
      city: data.city ? data.city : '',
      name: data.name ? data.name : '',
      country: data.country ? data.country : '',
      createdAt: data.createdAt ? data.createdAt : undefined,
      geoLocation: data.geoLocation && data.geoLocation.latitude && data.geoLocation.latitude
        ? new Parse.GeoPoint({
          latitude: data.geoLocation.latitude,
          longitude: data.geoLocation.longitude
        }) : undefined,
      id: data.objectId ? data.objectId : '',
      updatedAt: data.updatedAt ? data.updatedAt : undefined
    };
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
      buyerInfo: EventsGraphQLModel.toInfo(data.buyerInfo),
      completionDate: data.completionDate,
      createdAt: data.createdAt,
      id: data.objectId,
      orderedTickets: EventsGraphQLModel.toOrderedTicketsList(data.orderedTickets.edges),
      status: EventsGraphQLModel.toOrderStatus(data.status),
      updatedAt: data.updatedAt
    };
  }

  private static toOrderedTicketsList(data: any): TicketOrderInterface[] {
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
      address: this.toAddress(data.address),
      createdAt: data.createdAt,
      email: data.email,
      firstName: data.firstName,
      middleName: data.middleName ? data.middleName : "",
      id: data.objectId,
      lastName: data.lastName,
      organization: data.organization,
      phoneNumber: data.phoneNumber,
      updatedAt: data.updatedAt

    };
  }

  private static toOrderedTicket(data: any): TicketOrderInterface {
    return {
      attendeeInfo: this.toInfo(data.attendeeInfo),
      createdAt: data.createdAt,
      id: data.objectId,
      status: EventsGraphQLModel.toTicketStatus(data.status),
      ticketType: this.toTicketType(data.ticketType),
      updatedAt: data.updatedAt

    };
  }

  private static toTicketStatus(data: any): TicketStatusInterface {
    return {
      createdAt: data.createdAt,
      id: data.objectId,
      status: TicketStatusModel.getEnumKeyByEnumValue(data.statusName),
      updatedAt: data.updatedAt
    };
  }

  static getEnumKeyByEnumValue(myEnum: any, enumValue: number | string): string {
    let keys = Object.keys(myEnum).filter((x) => myEnum[x] == enumValue);
    return keys.length > 0 ? keys[0] : '';
  }

  private static toEmail(data: any): EmailInterface {
    const recipients: string[] = [];
    console.log(data)
    data.recipients.forEach((recipient: any) => {
      recipients.push(recipient.value)
    })
    return {
      createdAt: data.createdAt,
      id: data.objectId,
      updatedAt: data.updatedAt,
      html: data.html ? data.html : '',
      text: data.text ? data.text : '',
      sendDate: data.sendDate,
      recipients: recipients,
      body: data.body ? data.body : '',
      eventId: data.event.objectId,
      footer: data.footer ? data.footer : '',
      headerUrl: data.header ? (data.header.url as string).replace('graphq', 'parse') : '',
      isScheduled: data.isScheduled,
      subject: data.subject ? data.subject : ''
    };
  }
}
