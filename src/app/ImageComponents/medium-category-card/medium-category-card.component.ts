import {Component, Input, OnInit} from '@angular/core';
import {EventInterface, EventWebInterface} from "../../../Models/EventsModel.model";

@Component({
  selector: 'app-medium-category-card',
  templateUrl: './medium-category-card.component.html',
  styleUrls: ['./medium-category-card.component.css']
})
export class MediumCategoryCardComponent implements OnInit {
  @Input() carouselItem!: EventWebInterface;

  constructor() { }

  ngOnInit(): void {
  }

  getLocation(carouselItem: EventWebInterface) {
    let locName = '';
    locName += carouselItem.address.name ? ', '+carouselItem.address.name : '';
    locName += carouselItem.address.address1 ? ', '+carouselItem.address.address1 : '';

    if(locName.length===0){
      locName = 'Lafto Mall'
    }
    return locName;
  }
}
