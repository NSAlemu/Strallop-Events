import {Component} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {filter} from 'rxjs/operators'

declare let gtag: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Strallop Events';

  constructor(public router: Router) {
    this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          gtag('config', 'UA-206054272-1',
            {
              'page_path': event.urlAfterRedirects
            }
          );
        }
      }
    )
  }
}

