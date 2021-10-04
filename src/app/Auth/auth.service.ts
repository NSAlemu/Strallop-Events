import {Injectable} from '@angular/core';
import * as Parse from 'parse';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() {
  }

  login(username: string, password: string) {
    return Parse.User.logIn(username, password);
  }

  signUp(username: string, email: string, password: string) {
    const user = new Parse.User();
    user.set('username', username);
    user.set('password', password);
    user.set('email', email);
    return user.signUp();
  }
}
