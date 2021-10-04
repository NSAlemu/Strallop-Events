import * as Parse from "parse";
import {CardCheckListItemModel} from "./CardCheckListItemModel.model";
import {CardCheckListInterface} from "./CardCheckListModel.model";

export class CardLabelModel {

  static async toCardLabel(parseObject: Parse.Object): Promise<CardLabelInterface> {
    return {
      id: parseObject.id, createdAt: parseObject.createdAt, updatedAt: parseObject.updatedAt,
      color: parseObject.get('color'),
      label: parseObject.get('label'),
    }
  }

  static async toMultipleCardLabel(parseCardList: Parse.Object[]) {
    const cardList: CardLabelInterface[] = []
    for (const parseObject of parseCardList) {
      cardList.push(await this.toCardLabel(parseObject))
    }
    return cardList;
  }

  static async getCardLabel(listId: string): Promise<CardLabelInterface[]> {
    const checkLists: CardLabelInterface[] = []
    const query = new Parse.Query(Parse.Object.extend('CardLabel'))
      .equalTo('cardsAssignedTo', listId);
    this.subscriptionHandler(await query.subscribe(), listId, checkLists);
    const parseCardList = await query.find();
    checkLists.push(...(await this.toMultipleCardLabel(parseCardList)));
    return checkLists;
  }

  static async getAllCardLabelForEvent(eventId: string): Promise<CardLabelInterface[]> {
    const checkLists: CardLabelInterface[] = []
    const query = new Parse.Query(Parse.Object.extend('CardLabel'))
      .equalTo('event', Parse.Object.extend('Event').createWithoutData(eventId));
    this.allLabelsSubscriptionHandler(await query.subscribe(), checkLists);
    const parseCardList = await query.find();
    console.log('imcalled allcard get')
    checkLists.push(...(await this.toMultipleCardLabel(parseCardList)));
    return checkLists;
  }

  private static subscriptionHandler(subscription: Parse.LiveQuerySubscription, listId: string, cardList: CardLabelInterface[]) {
    subscription.on("create", async card => {
      console.log('label created')
      const createdCard = await this.toCardLabel(card)
      cardList.push(createdCard)
    })
    subscription.on("update", async parseObject => {
      console.log('card Updated')
      const editedCard = await this.toCardLabel(parseObject)

      if (parseObject.get('cardsAssignedTo').includes(listId)) {
        let found = false;
        cardList.forEach((card, i) => {
          if (card.id === editedCard.id) {
            cardList.splice(i, 1, editedCard)
            found = true
          }
        })
        if(!found)
        cardList.push(editedCard);
      } else {
        cardList.forEach((card, i) => {
          if (card.id === editedCard.id) {
            cardList.splice(i, 1)
            return;
          }
        })
      }
      console.log(editedCard)

    })
    subscription.on("delete", async parseObject => {
      const editedCard = await this.toCardLabel(parseObject)
      cardList.forEach((card, i) => {
        if (card.id === editedCard.id) {
          cardList.splice(i, 1)
        }
      })
    })
    subscription.on("enter", async parseObject => {
      console.log('label entered')
      const createdCard = await this.toCardLabel(parseObject)
      cardList.push(createdCard)
    })
    subscription.on("leave", async parseObject => {
      console.log('label left')
      cardList.forEach((card, i) => {
        if (card.id === parseObject.id) {
          cardList.splice(i, 1)
        }
      })
    })
  }

  private static allLabelsSubscriptionHandler(subscription: Parse.LiveQuerySubscription, cardList: CardLabelInterface[]) {
    subscription.on("create", async card => {
      console.log('label created')
      const createdCard = await this.toCardLabel(card)
      cardList.push(createdCard)
    })
    subscription.on("update", async parseObject => {
      console.log('card Updated')
      const editedCard = await this.toCardLabel(parseObject)
      cardList.forEach((card, i) => {
        if (card.id === editedCard.id) {
          cardList.splice(i, 1, editedCard)
        }
      })
    })
    subscription.on("delete", async parseObject => {
      const editedCard = await this.toCardLabel(parseObject)
      cardList.forEach((card, i) => {
        if (card.id === editedCard.id) {
          cardList.splice(i, 1)
        }
      })
    })
  }

  static async create(label: string, color: string, eventId: string, cardId: string) {
    const newObject = new (Parse.Object.extend('CardLabel'))();
    newObject.set('event', Parse.Object.extend('Event').createWithoutData(eventId))
    newObject.set('label', label);
    newObject.set('color', color);
    newObject.set('cardsAssignedTo', [cardId]);
    return await newObject.save();
  }

  static async editLabel(label: CardLabelInterface) {
    const object = await new Parse.Query(Parse.Object.extend('CardLabel')).get(label.id!);
    object.set('color', label.color)
    object.set('label', label.label)
    return await object.save();
  }

  static async deleteLabel(label: CardLabelInterface) {
    return await Parse.Object.extend('CardLabel').createWithoutData(label.id!).destroy();
  }

  static async editLabelAssignation(labelId: string, cardId: string) {
    const object = await new Parse.Query(Parse.Object.extend('CardLabel')).get(labelId);
    const assigneeArray: String[] = object.get('cardsAssignedTo') ? object.get('cardsAssignedTo') : [];
    if (assigneeArray.includes(cardId))
      assigneeArray.splice(assigneeArray.indexOf(cardId), 1);
    else
      assigneeArray.push(cardId);
    console.log(object.get('cardsAssignedTo'))
    if (!object.get('cardsAssignedTo'))
      object.set('cardsAssignedTo', assigneeArray);
    return await object.save();
  }

}

export interface CardLabelInterface {
  id?: string
  createdAt?: Date,
  updatedAt?: Date,
  label: string,
  color: ColorEnum
}

export enum ColorEnum {
  orange = '#ff9f1a', cyan = '#00c2e0', red = '#eb5a46', pink = '#ff78cb',
  green = '#61bd4f', blue = '#0079bf', yellow = '#f2d600', purple = '#c377e0',
}
