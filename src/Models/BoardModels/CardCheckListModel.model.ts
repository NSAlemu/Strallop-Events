import {CardCheckListItemInterface, CardCheckListItemModel} from "./CardCheckListItemModel.model";
import * as Parse from "parse";
import {BoardCardInterface} from "./BoardCardModel.model";

export class CardCheckListModel {
  static async toCheckList(parseObject: Parse.Object): Promise<CardCheckListInterface> {
    const itemList = await CardCheckListItemModel.getCheckListItem(parseObject.id);
    return {
      id: parseObject.id, createdAt: parseObject.createdAt, updatedAt: parseObject.updatedAt,
      checkListItems: itemList, dueDate: parseObject.get('dueDate'), name: parseObject.get('name'),
      position: parseObject.get('sortOrder')
    }
  }

  static async toMultipleCheckList(parseCardList: Parse.Object[]) {
    const cardList: CardCheckListInterface[] = []
    for (const parseObject of parseCardList) {
      cardList.push(await this.toCheckList(parseObject))
    }
    return cardList;
  }

  static async getCheckList(listId: string): Promise<CardCheckListInterface[]> {
    const checkLists: CardCheckListInterface[] = []
    const query = new Parse.Query(Parse.Object.extend('CardChecklist'))
      .ascending('sortOrder')
      .equalTo('card', Parse.Object.extend('ListCard').createWithoutData(listId));

    this.subscriptionHandler(await query.subscribe(), checkLists);
    const parseCardList = await query.find();
    checkLists.push(...(await this.toMultipleCheckList(parseCardList)));
    checkLists.sort((a, b) => a.position > b.position ? 1 : -1)
    return checkLists;
  }

  private static subscriptionHandler(subscription: Parse.LiveQuerySubscription, cardList: CardCheckListInterface[]) {
    subscription.on("create", async card => {
      const createdCard = await this.toCheckList(card)
      cardList.splice(createdCard.position, 0, createdCard)
    })
    subscription.on("update", async parseObject => {
      console.log('card Updated')
      const editedCard = await this.toCheckList(parseObject)
      cardList.forEach((card, i) => {
        if (card.id === editedCard.id) {
          cardList.splice(i, 1, editedCard)
        }
      })
      cardList.sort((a, b) => a.position > b.position ? 1 : -1)
    })
    subscription.on("delete", async parseObject => {
      const editedCard = await this.toCheckList(parseObject)
      cardList.forEach((card, i) => {
        if (card.id === editedCard.id) {
          cardList.splice(i, 1)
        }
      })
      cardList.sort((a, b) => a.position > b.position ? 1 : -1)
    })
  }

  static async create(name: string, id: string) {
    const newObject = new (Parse.Object.extend('CardChecklist'))();
    newObject.set('card', Parse.Object.extend('ListCard').createWithoutData(id))
    newObject.set('name', name);
    return await newObject.save();
  }

  static async transferCard(itemId: string, listId: string, newPreviousId: string | undefined, newNextId: string | undefined) {
    await Parse.Cloud.run("moveCardChecklist", {itemId, listId, newPreviousId, newNextId})
  }

  static async deleteItem(id: string) {
   await new Parse.Query(Parse.Object.extend('CardChecklistItem'))
      .equalTo('checklist', Parse.Object.extend('CardChecklist').createWithoutData(id))
      .find().then(value => {
        return Parse.Object.destroyAll(value);
      });
    return await Parse.Object.extend('CardChecklist').createWithoutData(id).destroy()
  }
}

export interface CardCheckListInterface {
  id?: string
  createdAt?: Date,
  updatedAt?: Date,
  dueDate: Date,
  name: string
  checkListItems: CardCheckListItemInterface[]
  position: number
}
