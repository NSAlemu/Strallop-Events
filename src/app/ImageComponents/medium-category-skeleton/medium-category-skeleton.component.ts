import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-medium-category-skeleton',
  templateUrl: './medium-category-skeleton.component.html',
  styleUrls: ['./medium-category-skeleton.component.css']
})
export class MediumCategorySkeletonComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  counter(i: number) {
    return new Array(i);
  }
}
