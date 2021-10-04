import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {map, shareReplay} from 'rxjs/operators';
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-setting-sidenav',
  templateUrl: './setting-sidenav.component.html',
  styleUrls: ['./setting-sidenav.component.css']
})
export class SettingSidenavComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver) {
  }

  ngOnInit(): void {
  }

}
