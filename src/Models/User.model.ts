import * as Parse from 'parse';
import {RolesModel, RolesModelInterface} from "./Roles.model";
import {HttpClient} from "@angular/common/http";
import {UserGraphQLModel} from "./GraphQL/UserGraphQL.model";

export class UserModel {
  id: string;
  updatedAt: Date;
  createdAt: Date;
  username: string;
  name: string;
  email: string;
  profilePictureURL: string

  constructor(parseUser: Parse.User) {
    this.id = parseUser.id;
    this.updatedAt = parseUser.updatedAt;
    this.createdAt = parseUser.createdAt;
    this.username = parseUser.get('username');
    this.name = parseUser.get('name');
    this.email = parseUser.get('email');
    this.profilePictureURL = parseUser.get('profileImg')
  }

  static toUserModels(parseUsers: Parse.User[]): UserModel[] {
    const userList: UserModel[] = [];
    parseUsers.forEach((parseUser) => {
      userList.push(new UserModel(parseUser));
    });
    const roles = RolesModel.getMainAccessRole();
    return userList;
  }

  static async signUpUser(newUser: UserInterface): Promise<Parse.User> {
    const user = new Parse.User();
    user.set('username', newUser.username);
    user.set('password', newUser.password);
    user.set('email', newUser.email);
    user.set('name', newUser.name);
    user.set('phone', newUser.phoneNumber ? newUser.phoneNumber : '');
    await user.signUp();
    await this.moveUserAccess(user.id, newUser.access.id!).then(value => {
      if (value instanceof Parse.Error) {
        return value;
      }
      return user;
    });
    return user;
  }

  static async moveUserAccess(userId: string, newRoleId: string) {
    const params = {userId, newRoleId};
    return await Parse.Cloud.run('moveUserAccess', params).then(value => {
      return value;
    }, reason => {
      return new Parse.Error(reason.code, reason.message);
    }).catch(reason => {
      return new Parse.Error(reason.code, reason.message);
    });
  }

  static async getAllParseUsers(): Promise<Parse.User[]> {
    return await new Parse.Query(Parse.User).find();
  }

  static async login(username: string, password: string): Promise<Parse.User> {
    return await Parse.User.logIn(username, password);
  }

  static async getUser(id: string): Promise<string> {
    return await new Parse.Query(Parse.User).get(id).then(
      value => {
        return value;
      }, reason => {
        return reason.message;
      }
    );
  }

  static getCurrentUser(): Parse.User {
    return Parse.User.current()!;
  }

  static async deleteUser(id: string): Promise<any> {
    await new Parse.Query(Parse.User).get(id).then(
      value => {
        return value.destroy();
      }, reason => {
        return reason.message;
      }
    ).then(() => {
      return '';
    }, () => {
      return 'Could not delete user';
    });

  }

  static logout(): Promise<any> {
    return Parse.User.logOut();
  }

  static async saveUser(newUser: UserInterface, profileImg?: File, profileUpdated?: boolean): Promise<UserModel | Parse.Error> {
    const user = Parse.User.createWithoutData(newUser.id!);
    user.set('name', newUser.name);
    user.set('username', newUser.username);
    if (newUser.id === Parse.User.current()!.id)
      user.set('email', newUser.email);
    user.set('phone', newUser.phoneNumber);
    if (profileUpdated) {
      if (profileImg) {
        const coverFile = await new Parse.File('profileImg.png', profileImg).save();
        user.set('profileImg', coverFile);
      } else {
        Parse.Cloud.run('deleteUserProfile');
      }
    }
    return await this.moveUserAccess(newUser.id!, newUser.access.id!).then(
      async value => {
        if (value instanceof Parse.Error) {
          return value;
        }
        return new UserModel(await user.save());
      }
    ).catch(reason => {
      return new Parse.Error(reason.code, reason.message);
    });
  }

  static async getAllParseUser(httpClient: HttpClient): Promise<UserInterface[]> {
    const userobjs =  await new Parse.Query(Parse.User).equalTo('organization',Parse.User.current()!.get('organization')).find()
    const users = [];
    for(const userobj of userobjs){
      users.push(this.toUserInterface(userobj))
    }
    return users
    // return await UserGraphQLModel.getAllUsers(httpClient);
  }

  static async getAccessList() {
    const allAccessRoles = await new Parse.Query(Parse.Role)
      .containedIn('name', ['Owner', 'Manager', 'Staff'])
      .find();
    return [{
      id: allAccessRoles[0].id,
      name: allAccessRoles[0].getName(),
      displayName: allAccessRoles[0].get('displayName') as string,
      users: [] as UserInterface[],
      roles: [] as UserAccess[]
    }, {
      id: allAccessRoles[1].id,
      name: allAccessRoles[1].getName(),
      displayName: allAccessRoles[1].get('displayName') as string,
      users: [] as UserInterface[],
      roles: [] as UserAccess[]
    }, {
      id: allAccessRoles[2].id,
      name: allAccessRoles[2].getName(),
      displayName: allAccessRoles[1].get('displayName') as string,
      users: [] as UserInterface[],
      roles: [] as UserAccess[]
    }]
  }

  static toUserInterface(currentUser: Parse.User): UserInterface {
    return {
      access: {
        name: '',
        displayName: '',
        users: [],
        roles: []
      },
      confirmPassword: "",
      email: currentUser.getEmail()!,
      name: currentUser.get('name'),
      password: "",
      phoneNumber: currentUser.get('phone'),
      username: currentUser.getUsername()!,
      id: currentUser.id,
      createdAt: currentUser.createdAt,
      updatedAt: currentUser.updatedAt
    };
  }

  static searchModel(data: UserModel, filter: string) {
    return data.username.toLocaleLowerCase().includes(filter) || data.name.toLocaleLowerCase().includes(filter);
  }

  static searchInterface(data: UserInterface, filter: string): boolean {
    return data.username.toLocaleLowerCase().includes(filter) || data.name.toLocaleLowerCase().includes(filter) ||
      (data.phoneNumber ? data.phoneNumber.toLocaleLowerCase().includes(filter) : false);
  }

  static async createUser(newUser: UserInterface, selectedAccessId: string) {
    const user = new Parse.User();
    user.set('username', newUser.username);
    user.set('password', newUser.password);
    user.set('email', newUser.email);
    user.set('name', newUser.name);
    user.set('phone', newUser.phoneNumber ? newUser.phoneNumber : '');
    await user.save();
    const allAccessRoles = await this.getAccessList()
    for (const access of allAccessRoles) {
      if (access.id === selectedAccessId) {
        const role = await new Parse.Query(Parse.Role).get(access.id)
        role.getUsers().add(user);
        await role.save();
      }
    }

    await this.moveUserAccess(user.id, newUser.access.id!).then(value => {
      if (value instanceof Parse.Error) {
        return value;
      }
      return user;
    });
    return user;
  }
}

export interface UserInterface {
  id?: string;
  updatedAt?: Date;
  createdAt?: Date;
  username: string;
  password: string;
  confirmPassword: string;
  name: string;
  email: string;
  phoneNumber?: string;
  access: UserAccess;
}

export interface UserAccess {
  id?: string;
  updatedAt?: Date;
  createdAt?: Date;
  name: string;
  displayName: string;
  profilePictureURL?: string;
  users: UserInterface[];
  roles: UserAccess[];
}

