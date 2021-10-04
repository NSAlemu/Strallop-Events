import {UserInterface} from "../User.model";
import * as Parse from "parse";
import {CardCheckListInterface} from "./CardCheckListModel.model";

export class CardCheckListItemModel {
  static toCheckListItem(parseObject: Parse.Object): CardCheckListItemInterface {
    return {
      id: parseObject.id, createdAt: parseObject.createdAt, updatedAt: parseObject.updatedAt,
      assignedTo: [],
      completed: parseObject.get('completed'),
      description: parseObject.get('description'),
      position: parseObject.get('sortOrder')
    }
  }

  static toMultipleCheckListItems(parseCardList: Parse.Object[]) {
    const cardList: CardCheckListItemInterface[] = []
    parseCardList.forEach(parseObject => {
      cardList.push(this.toCheckListItem(parseObject))
    })
    return cardList;
  }

  static async getCheckListItem(listId: string): Promise<CardCheckListItemInterface[]> {
    const checkLists: CardCheckListItemInterface[] = []
    const query = new Parse.Query(Parse.Object.extend('CardChecklistItem'))
      .ascending('sortOrder')
      .equalTo('checklist', Parse.Object.extend('CardChecklist').createWithoutData(listId));

    this.subscriptionHandler(await query.subscribe(), checkLists);
    const parseCardList = await query.find();
    checkLists.push(...this.toMultipleCheckListItems(parseCardList));
    checkLists.sort((a, b) => a.position > b.position ? 1 : -1)
    return checkLists;
  }
  private static subscriptionHandler(subscription: Parse.LiveQuerySubscription, cardList: CardCheckListItemInterface[]) {
    subscription.on("create", card => {
      const createdCard = this.toCheckListItem(card)
        cardList.splice(createdCard.position, 0, createdCard)
    })
    subscription.on("update", parseObject => {
      console.log('card Updated')
      const editedCard = this.toCheckListItem(parseObject)
      cardList.forEach((card, i) => {
        if (card.id === editedCard.id) {
          cardList.splice(i, 1, editedCard)
        }
      })
      cardList.sort((a, b) => a.position > b.position ? 1 : -1)
    })
    subscription.on("delete", parseObject => {
      const editedCard = this.toCheckListItem(parseObject)
      cardList.forEach((card, i) => {
        if (card.id === editedCard.id) {
          cardList.splice(i, 1)
        }
      })
      cardList.sort((a, b) => a.position > b.position ? 1 : -1)
    })
  }

  static async transferCard(itemId: string, listId: string, newPreviousId: string | undefined, newNextId: string | undefined) {
    await Parse.Cloud.run("moveCardChecklistItem", {itemId, listId, newPreviousId, newNextId})
  }

  static async create(description: string, id: string) {
    const newObject = new (Parse.Object.extend('CardChecklistItem'))();
    newObject.set('checklist', Parse.Object.extend('CardChecklist').createWithoutData(id))
    newObject.set('description', description);
    return await newObject.save();
  }

  static async saveDescription(description: string, id: string) {
    const object = await new Parse.Query(Parse.Object.extend('CardChecklistItem')).get(id);
    object.set('description', description);
    return await object.save();
  }

  static async deleteItem(id: string) {
    return await Parse.Object.extend('CardChecklistItem').createWithoutData(id).destroy()
  }

  static async setCompleted(completed: boolean, id: string) {
    const object = await new Parse.Query(Parse.Object.extend('CardChecklistItem')).get(id);
    object.set('completed', completed);
    return await object.save();
  }
}
export interface CardCheckListItemInterface {
  id?: string
  createdAt?: Date,
  updatedAt?: Date,
  description: string,
  assignedTo: UserInterface[]
  completed: boolean;
  position: number
}
