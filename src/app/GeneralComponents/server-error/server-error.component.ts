import { Component, OnInit } from '@angular/core';
import {Title} from "@angular/platform-browser";


@Component({
  selector: 'app-server-error',
  templateUrl: './server-error.component.html',
  styleUrls: ['./server-error.component.css']
})
export class ServerErrorComponent implements OnInit {

  constructor(private titleService: Title) {
    this.titleService.setTitle('Server Error');
  }
  ngOnInit(): void {
  }

}
