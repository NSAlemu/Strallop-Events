import {Component, OnInit} from '@angular/core';
import * as Parse from 'parse';
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-not-found-component',
  templateUrl: './not-found-component.component.html',
  styleUrls: ['./not-found-component.component.css']
})
export class NotFoundComponentComponent implements OnInit {
  roleIds = ['AUhIXCtxG5',
    '2aWOQv6xNH',
    '2aWOQv6xNH'];
  roles: Parse.Role[] = [];
  role!: Parse.Role;
  name = '';

  constructor(private titleService: Title) {
    this.titleService.setTitle('Page Not Found');
    (new Parse.Query(Parse.Role)).find().then(
      value => {
        this.roles = value as Parse.Role[];
        this.name = value[2].get('name');
        return this.role = value[2];
      }, reason => {
        return reason;
      }
    );
  }

  ngOnInit(): void {
  }

  addUser() {
    this.role.getUsers().add(Parse.User.current() as Parse.User);
    this.role.save();
  }

  removeUser() {
    this.role.getUsers().remove(Parse.User.current() as Parse.User);
    this.role.save();
  }

  addRole() {
    this.role.getRoles().add(this.roles[3]);
    this.role.save();
  }

  removeRole() {
    this.role.getRoles().remove(this.roles[3]);
    this.role.save();
  }

}
