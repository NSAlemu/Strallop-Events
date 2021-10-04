import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {map, shareReplay} from 'rxjs/operators';
import {MatSidenav} from '@angular/material/sidenav';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {UserModel} from "../../../Models/User.model";
import {AlertSnackBar} from "../../Util/shared";

@Component({
  selector: 'app-toolbar-component',
  templateUrl: './toolbar-component.component.html',
  styleUrls: ['./toolbar-component.component.css']
})
export class ToolbarComponentComponent implements OnInit {
  @Input() drawer!: MatSidenav;
  @Input() textColor!: string;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  currentUser = UserModel.getCurrentUser();
  currentUserImg = !this.currentUser.get('profileImg') || this.currentUser.get('profileImg') == null ? undefined : this.currentUser.get('profileImg')

  constructor(private breakpointObserver: BreakpointObserver, private router: Router, private snackBar: MatSnackBar) {
  }

  async ngOnInit() {
    this.currentUser = await UserModel.getCurrentUser().fetch();
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
