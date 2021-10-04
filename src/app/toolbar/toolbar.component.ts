import { Component, OnInit } from '@angular/core';
import {UserModel} from "../../Models/User.model";

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  currentUserImg: any = '';
  currentUser = UserModel.getCurrentUser();

  constructor() { }

  ngOnInit(): void {

  }

  logout() {

  }
}
