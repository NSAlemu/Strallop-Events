import * as Parse from 'parse';

export class AddressModel {

  static toAddress(parseObject: Parse.Object): AddressInterface {
    if(!parseObject){
      return {
        name: '',
        address1: '',
        address2: '',
        city: '',
        country: '',
      };
    }
    return {
      id: parseObject.id?parseObject.id:'',
      name: parseObject.get('name')?parseObject.get('name'):'',
      updatedAt: parseObject.updatedAt?parseObject.updatedAt:new Date(),
      createdAt: parseObject.updatedAt?parseObject.updatedAt:new Date(),
      address1: parseObject.get('address1')?parseObject.get('address1'):'',
      address2: parseObject.get('address2')? parseObject.get('address2'):'',
      city: parseObject.get('city')?parseObject.get('city'):'',
      country: parseObject.get('country')?parseObject.get('country'):'',
      geoLocation: parseObject.get('geoLocation')?parseObject.get('geoLocation'):''
    };
  }

  static async toParse(address: AddressInterface) {
    const addressObject = new (Parse.Object.extend('Address'))();
    addressObject.set('name', address.name);
    addressObject.set('address1', address.address1);
    addressObject.set('address2', address.address2);
    addressObject.set('city', address.city);
    addressObject.set('country', address.country);
    return await addressObject.save();
  }

  static fromJSONToAddress(json: any) {
    return {
      name: json['House No'],
      address1: json['Street'],
      address2: json['Kifle Ketema'],
      city: json['City'],
      country: json['Country'],
    };
  }

  static search(data: AddressInterface, filter: string) {
    return data.name.toLocaleLowerCase().includes(filter) || data.address1.toLocaleLowerCase().includes(filter) ||
      data.address2.toLocaleLowerCase().includes(filter) || data.city.toLocaleLowerCase().includes(filter) ||
      data.country.toLocaleLowerCase().includes(filter);
  }

  static getAddress(address: AddressInterface) {
    return address.name+", "+address.address1+", "+address.address2+", ";
  }

  static toWebAddress(object: any): AddressInterface {
    return {
      address1: object.address1? object.address1:'',
      address2:  object.address2? object.address2:'',
      city:  object.city? object.city:'',
      country:  object.country? object.country:'',
      createdAt:  object.createdAt? object.createdAt:'',
      geoLocation:  object.geoLocation? object.geoLocation:'',
      id:  object.id? object.id:'',
      name:  object.name? object.name:'',
      updatedAt:  object.updatedAt? object.updatedAt:''
    }
  }
}

export interface AddressInterface {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  name: string;
  address1: string;
  address2: string;
  city: string;
  country: string;
  geoLocation?: Parse.GeoPoint;
}
