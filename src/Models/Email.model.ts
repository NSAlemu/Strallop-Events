import * as Parse from "parse";
import {PersonalInformationModel} from "./PersonalInformationModel";
import {OrderInterface} from "./OrderModel.model";


export class EmailModel {
  static async save(email: EmailInterface) {
    const obj = await new Parse.Query(Parse.Object.extend('Email')).get(email.id!);
    obj.set('body', email.body)
    obj.set('footer', email.footer)
    obj.set('text', email.text)
    obj.set('sendDate', email.sendDate)
    obj.set('recipients', email.recipients)
    obj.set('subject', email.subject)
    obj.set('html', email.html)
    if (email.headerFile) {
      const headerFile = await new Parse.File('emailHeader.png', email.headerFile).save();
      obj.set('header', headerFile)
    }
    await obj.save();
  }

  static toWebEmail(object: any): EmailInterface {
    if(!object){
      return {
        body: "",
        createdAt: undefined,
        eventId: "",
        footer: "",
        headerUrl: "",
        html: "",
        id: "",
        isScheduled: false,
        recipients: [],
        sendDate: new Date(),
        subject: "",
        text: "",
        updatedAt: undefined
      }
    }
    return {
      body: object.address1 ? object.address1 : '',
      eventId: object.address1 ? object.address1 : '',
      footer: object.address1 ? object.address1 : '',
      headerUrl: object.address1 ? object.address1 : '',
      html: object.address1 ? object.address1 : '',
      isScheduled: object.address1 ? object.address1 : false,
      recipients: object.address1 ? object.address1 : '',
      subject: object.address1 ? object.address1 : '',
      text: object.address1 ? object.address1 : '',
    };
  }

  static toEmail(parseObject: Parse.Object):EmailInterface {
    if(!parseObject){
      return {
        body: "",
        createdAt: undefined,
        eventId: "",
        footer: "",
        headerFile: undefined,
        headerUrl: "",
        html: "",
        id: "",
        isScheduled: false,
        recipients: [],
        sendDate: undefined,
        subject: "",
        text: "",
        updatedAt: undefined

      };
    }
    return {
      id: parseObject.id?parseObject.id:'',
      updatedAt: parseObject.updatedAt?parseObject.updatedAt:new Date(),
      createdAt: parseObject.updatedAt?parseObject.updatedAt:new Date(),
      body:  parseObject.get('body')?parseObject.get('body'):'',
      eventId: parseObject.get('eventId')?parseObject.get('eventId').id:'',
      footer: parseObject.get('footer')?parseObject.get('footer'):'',
      headerUrl:  parseObject.get('headerUrl')?parseObject.get('headerUrl'):'',
      html:  parseObject.get('html')?parseObject.get('html'):'',
      isScheduled:  parseObject.get('isScheduled')?parseObject.get('isScheduled'):false,
      recipients:  parseObject.get('recipients')?parseObject.get('recipients'):[],
      sendDate:  parseObject.get('sendDate')?parseObject.get('sendDate'):'',
      subject:  parseObject.get('subject')?parseObject.get('subject'):'',
      text:  parseObject.get('text')?parseObject.get('text'):'',
    };
  }
}

export interface EmailInterface {
  id?: string,
  createdAt?: Date,
  updatedAt?: Date,
  html: string,
  text: string,
  recipients: string[],
  sendDate?: Date
  eventId: string,
  isScheduled: boolean,
  subject: string,
  headerUrl: string,
  headerFile?: File;
  body: string,
  footer: string,
}
