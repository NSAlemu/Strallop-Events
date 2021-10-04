import * as Parse from 'parse';
import {UserModel} from './User.model';

export class RolesModel {

  static async toStatus(parseObject: Parse.Role): Promise<RolesModelInterface> {
    return {
      id: parseObject.id,
      createdAt: parseObject.createdAt,
      updatedAt: parseObject.updatedAt,
      name: parseObject.get('displayName'),
      planningRead: parseObject.get('roleEnum').get('planningRead'),
      planningWrite: parseObject.get('roleEnum').get('planningWrite'),
      eventRead: parseObject.get('roleEnum').get('eventRead'),
      eventWrite: parseObject.get('roleEnum').get('eventWrite'),
      orderRead: parseObject.get('roleEnum').get('orderRead'),
      orderWrite: parseObject.get('roleEnum').get('orderWrite'),
      roleReadWrite: parseObject.get('roleEnum').get('roleReadWrite'),
      users: UserModel.toUserModels(await parseObject.getUsers().query().find())
    };
  }

  static async getUserEventRole(userId: string, eventId: string): Promise<RolesModelInterface> {
    return await Parse.Cloud.run("checkEventRole", {userId, eventId});
  }

  static async getEventRoles(eventId: string): Promise<Parse.Role[]> {
    return await new Parse.Query(Parse.Role)
      .equalTo('event', Parse.Object.extend('Event').createWithoutData(eventId)).include('roleEnum').find();
  }

  static async toNewParse(eventId: string, role: RolesModelInterface) {
    return await Parse.Cloud.run("createEventRole", {eventId, role});
  }

  static async updateRole(role: RolesModelInterface) {
    return await Parse.Cloud.run("updateEventRole", {role});
  }

  static async moveUserRole(userId: string, eventId: string, newRoleId: string) {
    const params = {eventId, userId, newRoleId};
    return await Parse.Cloud.run('moveUserRole', params).then(value => {
      return value;
    }, reason => {
      return new Parse.Error(reason.code, reason.message);
    });
  }

  static async removeUserFromEvent(eventId: string, userId: string) {
    return await new Parse.Query(Parse.Role)
      .equalTo('users', Parse.User.createWithoutData(userId))
      .equalTo('event', Parse.Object.extend('Event').createWithoutData(eventId)).first().then(
        value => {
          value?.getUsers().remove(Parse.User.createWithoutData(userId));
          value?.save();
        }
      );
  }

  static async getMainAccessRole(): Promise<Parse.Object[]> {
    return await new Parse.Query(Parse.Role)
      .containedIn('name', ['Owner', 'Manager', 'Staff']).include('roleEnum').find();
  }

  getAccessRoles() {

  }

  static search(data: RolesModelInterface, filter: string) {
    return data.name.toLocaleLowerCase().includes(filter);
  }
}

export interface RolesModelInterface {
  id?: string;
  updatedAt?: Date;
  createdAt?: Date;
  name: string;
  eventRead: boolean;
  eventWrite: boolean;
  orderRead: boolean;
  orderWrite: boolean;
  planningRead: boolean;
  planningWrite: boolean;
  roleReadWrite: boolean;
  users: UserModel[];
}

export enum TicketStatusEnum {
  checkedIn = 'Checked In',
  pending = 'Pending',
  preregistered = 'Preregistered',
  registered = 'Registered'
}
