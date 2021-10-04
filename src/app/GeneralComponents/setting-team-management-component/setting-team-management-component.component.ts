import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Observable} from 'rxjs';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {map, shareReplay} from 'rxjs/operators';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import * as Parse from 'parse';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent, DialogData} from '../../../shared/confirm-dialog/confirm-dialog.component';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {Title} from "@angular/platform-browser";
import {UserInterface, UserModel} from "../../../Models/User.model";
import {AlertSnackBar} from "../../Util/shared";

const userData = [{id: '', username: 'nsalemu', name: 'Nebiyou Shiferaw', email: 'nebiyou.gmail.com'}];

@Component({
  selector: 'app-setting-team-management-component',
  templateUrl: './setting-team-management-component.component.html',
  styleUrls: ['./setting-team-management-component.component.css']
})
export class SettingTeamManagementComponentComponent implements AfterViewInit {
  isAddUserOpen = false;

  newUser: UserInterface = {
    name: '',
    email: '',
    username: '',
    confirmPassword: '',
    password: '',
    access: {name: '', displayName: '', users: [], roles: []},
  };
  // accessList!: UserAccess[];
  isUserPage = false;
  displayedColumns: string[] = ['Name', 'Username', 'Role', 'Action'];
  userList: UserInterface[] = [];
  dataSource = new MatTableDataSource(this.userList);
  roles = {};
  currentUserId = Parse.User.current()!.id;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  amount = '0';
  loading = false;
  selectedAccessLevel = '';

  constructor(private titleService: Title, private breakpointObserver: BreakpointObserver, private snackBar: MatSnackBar, private confirmDialog: MatDialog, private httpClient: HttpClient) {
    this.titleService.setTitle('Account Settings');

  }


  async ngAfterViewInit() {
    await this.getUsers();
  }

  async getUsers() {
    // this.accessList = await UserModel.getAccessList();
    this.userList = [];
    this.userList = await UserModel.getAllParseUser(this.httpClient);
    this.dataSource = new MatTableDataSource(this.userList);
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'Name':
          return item.name;
        case 'Username':
          return item.username;
        case 'Role':
          return item.name;
        case 'Action':
          return item.name;
        default:
          return item.name;
      }
    };
    this.dataSource.filterPredicate = (data, filter) => {
      return UserModel.searchInterface(data, filter);
    };
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  openConfirmationDialog(id: string, username: string) {
    const dialogRef = this.confirmDialog.open(ConfirmDialogComponent, {
      data: {id, message: 'Are you sure you want to Delete \"' + username + '\"?'}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.confirm) {
        UserModel.deleteUser(id).then(value => {
          const success = value.length === 0;
          AlertSnackBar(this.snackBar, success,
            success ? 'User ' + result.id + ' Deleted' : value);
        }, reason => {
          AlertSnackBar(this.snackBar, false,
            reason.message);
        });

      }
    });
  }

  applyFilter(value: Event) {
    let filterValue = (<HTMLInputElement>value.target).value.trim();// Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  async onSubmit() {
    this.isAddUserOpen = false;
    if (!this.newUser.id) {
      await UserModel.createUser(this.newUser, this.selectedAccessLevel).then(value => {
        this.getUsers();
        AlertSnackBar(this.snackBar, true, 'User \"' + value.get('username') + '\" created');
      }, reason => {
        this.getUsers();
        AlertSnackBar(this.snackBar, false, reason.code === 206 ? 'You don\'t have the access to perform this function' : reason.message);
      });
    }
    else {
      this.newUser.access.id = this.selectedAccessLevel;
      await UserModel.saveUser(this.newUser).then(value => {
        if (value instanceof Parse.Error) {
          AlertSnackBar(this.snackBar, false, value.code === 206 ? 'You don\'t have the access to perform this function' : value.message);
        } else {
          AlertSnackBar(this.snackBar, true, "User " + value.username + " Updated!");
        }
        this.getUsers();
      });
    }
    this.selectedAccessLevel = ''
    this.isAddUserOpen = false;
    this.newUser = {
      name: '',
      email: '',
      username: '',
      confirmPassword: '',
      password: '',
      access: {name: '', displayName: '', users: [], roles: []},
    };
  }

  editUser(row: UserInterface) {
    this.selectedAccessLevel = row.access.id!;
    this.newUser = {
      id: row.id,
      confirmPassword: "",
      email: row.email,
      name: row.name,
      password: "",
      phoneNumber: row.phoneNumber,
      username: row.username,
      access: {
        id: row.access.id,
        name: row.access.name,
        displayName: row.access.name,
        users: [],
        roles: []
      }
    }
    this.isAddUserOpen = true;
  }

  CloseAddUser() {
    this.isAddUserOpen = false;
    this.newUser = {
      name: '',
      email: '',
      username: '',
      confirmPassword: '',
      password: '',
      access: {name: '', displayName: '', users: [], roles: []},
    };
  }



  isUserRowSelected(row: UserInterface) {
    return row.id === this.newUser.id;
  }
}


