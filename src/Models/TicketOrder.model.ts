import * as Parse from 'parse';
import {TicketTypeInterface, TicketTypeModel} from './TicketType.model';
import {TicketStatusEnum, TicketStatusInterface, TicketStatusModel} from './TicketStatus.model';
import {PersonalInformationInterface, PersonalInformationModel} from './PersonalInformationModel';

export class TicketOrderModel {

  static async customQuery(query: Parse.Query): Promise<Parse.Object[] | void> {
    return await query.find().then(
      value => {
        return value;
      }, reason => {
        console.log(reason.message);
      });
  }

  static toMultipleTicketOrder(parseObjects: Parse.Object[]): TicketOrderInterface[] {
    const ticketOrder: TicketOrderInterface[] = [];
    parseObjects.forEach(parseObject => {
      ticketOrder.push(this.toTicketOrder(parseObject));
    });
    return ticketOrder;
  }

  static fromJSONtoTicketOrder(json: any): TicketOrderInterface {
    return {
      attendeeInfo: PersonalInformationModel.fromJsonToInfo(json),
      status: {
        status: TicketStatusEnum.registered
      },
      ticketType: {
        name: '',
        price: 0,
        capacity: 0,
        salesStartDate: new Date(),
        salesEndDate: new Date(),
      },
    };
  }

  static toTicketOrder(parseObject: Parse.Object): TicketOrderInterface {
    return {
      id: parseObject.id,
      createdAt: parseObject.createdAt,
      updatedAt: parseObject.updatedAt,
      attendeeInfo: PersonalInformationModel.toInfo(parseObject.get('attendeeInfo')),
      status: TicketStatusModel.toStatus(parseObject.get('status')),
      ticketType: TicketTypeModel.toTicketType(parseObject.get('ticketType')),
    };
  }

  static async saveToParse(editingAttendee: TicketOrderInterface, selectedTicketTypeId?:string, selectedStatusId?: string): Promise<void> {
    let parseAttendee = new (Parse.Object.extend('TicketOrder'))();
    if (editingAttendee.id)
      parseAttendee = await new Parse.Query(Parse.Object.extend('TicketOrder'))
        .include('ticketType').include('attendeeInfo.address').include('status').include('attendeeInfo')
        .get(editingAttendee.id);
    const parseStatus = parseAttendee.get('status');
    if (selectedTicketTypeId) {
      parseAttendee.set('ticketType', Parse.Object.extend('TicketType').createWithoutData(selectedTicketTypeId))
      await parseAttendee.save();
    }
    if (selectedStatusId) {
      parseAttendee.set('status', Parse.Object.extend('TicketStatus').createWithoutData(selectedStatusId))
      await parseAttendee.save();
    }
    const parseTicketType = parseAttendee.get('ticketType');
    // TODO: update Status
    const parseAttendeeInfo = parseAttendee.get('attendeeInfo');
    parseAttendeeInfo.set('firstName', editingAttendee.attendeeInfo.firstName);
    parseAttendeeInfo.set('middleName', editingAttendee.attendeeInfo.middleName);
    parseAttendeeInfo.set('lastName', editingAttendee.attendeeInfo.lastName);
    parseAttendeeInfo.set('email', editingAttendee.attendeeInfo.email);
    parseAttendeeInfo.set('phoneNumber', editingAttendee.attendeeInfo.phoneNumber);
    parseAttendeeInfo.set('organization', editingAttendee.attendeeInfo.organization);
    const parseAttendeeAddress = parseAttendeeInfo.get('address');
    parseAttendeeAddress.set('name', editingAttendee.attendeeInfo.address.name);
    parseAttendeeAddress.set('address1', editingAttendee.attendeeInfo.address.address1);
    parseAttendeeAddress.set('address2', editingAttendee.attendeeInfo.address.address2);
    parseAttendeeAddress.set('city', editingAttendee.attendeeInfo.address.city);
    parseAttendeeAddress.set('country', editingAttendee.attendeeInfo.address.country);
    await parseAttendeeAddress.save();
    await parseAttendeeInfo.save();
    return;
  }

  static search(data: TicketOrderInterface, filter: string): boolean{
    return PersonalInformationModel.search(data.attendeeInfo, filter) ||
      TicketTypeModel.search(data.ticketType, filter);
  }
}

export interface TicketOrderInterface {
  id?: string;
  updatedAt?: Date;
  createdAt?: Date;
  ticketType: TicketTypeInterface;
  status: TicketStatusInterface;
  attendeeInfo: PersonalInformationInterface;
}
