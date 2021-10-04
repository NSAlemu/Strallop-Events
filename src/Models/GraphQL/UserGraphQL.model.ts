import * as Parse from 'parse';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {EventInterface} from '../EventsModel.model';
import {EventStatusEnum, EventStatusInterface} from '../EventStatus.model';
import {TicketTypeInterface} from '../TicketType.model';
import {AddressInterface} from '../Address.model';
import {OrderInterface} from '../OrderModel.model';
import {PersonalInformationInterface} from '../PersonalInformationModel';
import {OrderStatusEnum, OrderStatusInterface} from '../OrderStatus.model';
import {TicketOrderInterface} from '../TicketOrder.model';
import {TicketStatusEnum, TicketStatusInterface} from '../TicketStatus.model';
import {UserAccess, UserInterface, UserModel} from "../User.model";
import {serverLocation} from "../../app/Util/shared";

const qlQuery = {
  operationName: "findUsers",
  variables: {},
  query: "query findUsers {\n  roles() {\n    count\n    edges {\n      node {\n        objectId\n        createdAt\n        updatedAt\n        name\n        displayName\n        users {\n          edges {\n            node {\n              objectId\n              createdAt\n              updatedAt\n              username\n              name\n              email\n              phone\n            }\n          }\n        }\n      }\n    }\n  }\n}\n"
};

export class UserGraphQLModel {
  static async getAllUsers(http: HttpClient): Promise<UserInterface[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Parse-Application-Id': 'APPLICATION_ID',
        // @ts-ignore
        'X-Parse-Session-Token': Parse.User.current()?.getSessionToken()
      })
    };
    return await http.post(serverLocation + '/graphql', qlQuery, httpOptions)
      .toPromise().then(value => {
        // @ts-ignore
        return this.toUserList(value.data.roles.edges);
      });
  }


  static toUserList(edges: any): UserInterface[] {
    const userList: UserInterface[] = [];
    // @ts-ignore
    edges.forEach(access => {
      userList.push(...this.toUserAccess(access.node));
    });
    return userList;
  }

  static toUserAccess(data: any): UserInterface[] {
    const userList: UserInterface[] = [];
    const access: UserAccess = {
      createdAt: data.createdAt,
      displayName: data.displayName,
      id: data.objectId,
      name: data.name,
      roles: [],
      updatedAt: data.updatedAt,
      users: []
    }
    // @ts-ignore
    data.users.edges.forEach(userData => {
      userList.push(this.toUser(userData.node, access));
    })
    return userList;
  }

  private static toUser(userData: any, access: UserAccess): UserInterface {
    return {
      access: access,
      confirmPassword: "",
      email: userData.email ? userData.email : "",
      id: userData.objectId,
      name: userData.name,
      password: "",
      phoneNumber: userData.phone,
      updatedAt: userData.updatedAt,
      username: userData.username

    };
  }
}
