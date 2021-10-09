import {Component, Input, OnInit} from '@angular/core';
import {EventInterface, EventWebInterface} from "../../../Models/EventsModel.model";
import {FormatAddress} from "../../Util/shared";

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
    return FormatAddress(carouselItem.address)? FormatAddress(carouselItem.address):'';
  }

  getMinPrice() {
    let minPrice = Infinity;
    if(!this.carouselItem.tickets || this.carouselItem.tickets.length ===0){
      return null
    }
    this.carouselItem.tickets.forEach(ticket=>{
      if(ticket.price<minPrice){
        minPrice = ticket.price;
      }
    })
    if(minPrice<=0){
      return 'Free'
    }
    return minPrice;
  }
}
