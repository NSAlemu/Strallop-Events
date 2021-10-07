import {Component, Input, OnInit} from '@angular/core';
import {UserModel} from "../../Models/User.model";
import {MatSidenav} from "@angular/material/sidenav";
import {AlertSnackBar} from "../Util/shared";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Observable} from "rxjs";
import {map, shareReplay} from "rxjs/operators";

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  @Input() drawer!: MatSidenav;
  @Input() textColor!: string;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  currentUser:Parse.User|undefined = UserModel.getCurrentUser();
  currentUserImg='';

  constructor(private breakpointObserver: BreakpointObserver, private router: Router, private snackBar: MatSnackBar) {
  }

  async ngOnInit() {
    this.currentUser = UserModel.getCurrentUser()? await UserModel.getCurrentUser().fetch(): undefined;
    if(this.currentUser)
    this.currentUserImg = !this.currentUser.get('profileImg') || this.currentUser.get('profileImg') == null ? undefined : this.currentUser.get('profileImg')
  }

  logout() {
    UserModel.logout().then(() => {
      this.router.navigateByUrl('/login');
    }, reason => {
      AlertSnackBar(this.snackBar, false, reason.message);
    });
  }
}
