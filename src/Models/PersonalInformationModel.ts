import * as Parse from 'parse';
import {AddressInterface, AddressModel} from './Address.model';
import {TicketOrderInterface} from "./TicketOrder.model";

export class PersonalInformationModel {

  static toInfo(parseObject: Parse.Object): PersonalInformationInterface {
    return {
      middleName: parseObject.get('middleName') ? parseObject.get('middleName') : '',
      id: parseObject.id,
      createdAt: parseObject.createdAt,
      updatedAt: parseObject.updatedAt,
      email: parseObject.get('email') ? parseObject.get('email') : '',
      firstName: parseObject.get('firstName'),
      address: AddressModel.toAddress(parseObject),
      lastName: parseObject.get('lastName') ? parseObject.get('lastName') : '',
      organization: parseObject.get('organization') ? parseObject.get('organization') : '',
      phoneNumber: parseObject.get('phoneNumber') ? parseObject.get('phoneNumber') : ''
    };
  }

  static fromJsonToInfo(json: any): PersonalInformationInterface {
    return {
      email: json['Email'] ? json['Email'] : '',
      firstName: json['First Name*'] ? json['First Name*'] : '',
      middleName: json['Middle Name*'] ? json['Middle Name*'] : '',
      lastName: json['Last Name*'] ? json['Last Name*'] : '',
      address: AddressModel.fromJSONToAddress(json),
      organization: json['Organization*'] ? json['Organization*'] : '',
      phoneNumber: json['Phone Number*'] ? json['Phone Number*'] : ''
    };
  }

  static async toParse(attendeeInfo: PersonalInformationInterface) {
    const infoObject = new (Parse.Object.extend('PersonalInformation'))();
    infoObject.set('firstName', attendeeInfo.firstName);
    infoObject.set('middleName', attendeeInfo.middleName);
    infoObject.set('lastName', attendeeInfo.lastName);
    infoObject.set('phoneNumber', attendeeInfo.phoneNumber.toString());
    infoObject.set('organization', attendeeInfo.organization);
    infoObject.set('email', attendeeInfo.email);
    infoObject.set('address', await AddressModel.toParse(attendeeInfo.address!));
    return await infoObject.save();
  }
  static search(data: PersonalInformationInterface, filter: string): boolean{
    return data.firstName.toLocaleLowerCase().includes(filter)  ||
      data.middleName.toLocaleLowerCase().includes(filter) ||data.lastName.toLocaleLowerCase().includes(filter) ||
      data.organization.toLocaleLowerCase().includes(filter) ||
      data.phoneNumber.toLocaleLowerCase().includes(filter) ||data.email.toLocaleLowerCase().includes(filter);
  }
}

export interface PersonalInformationInterface {
  id?: string;
  updatedAt?: Date;
  createdAt?: Date;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  organization: string;
  middleName: string;
  address: AddressInterface;
}
