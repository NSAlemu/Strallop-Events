import {UserInterface} from "../User.model";
import {CardLabelInterface, CardLabelModel} from "./CardLabelModel.model";
import {CardCheckListInterface, CardCheckListModel} from "./CardCheckListModel.model";
import * as Parse from 'parse'

export class BoardCardModel {

  static async getCards(listId: string): Promise<BoardCardInterface[]> {
    const cardList: BoardCardInterface[] = []
    console.log(listId)
    const query = new Parse.Query(Parse.Object.extend('ListCard'))
      .equalTo('boardList', Parse.Object.extend('BoardList').createWithoutData(listId));

    this.subscriptionHandler(await query.subscribe(), cardList);
    const parseCardList = await query.find();
    cardList.push(...(await this.toMultipleCardList(parseCardList)));
    cardList.sort((a, b) => a.position > b.position ? 1 : -1)
    return cardList;
  }

  static async getCardById(id: string){
    return await this.toCard(await new Parse.Query(Parse.Object.extend('ListCard')).get(id));
  }

  private static subscriptionHandler(subscription: Parse.LiveQuerySubscription, cardList: BoardCardInterface[]) {
    subscription.on("create", async card => {
      const createdCard = await this.toCard(card)
      cardList.splice(createdCard.position, 0, createdCard)
    })
    subscription.on("update", async parseObject => {
      console.log('card Updated')
      const editedCard = await this.toCard(parseObject)
      cardList.forEach((card, i) => {
        if (card.id === editedCard.id) {
          cardList.splice(i, 1, editedCard)
        }
      })
      cardList.sort((a, b) => a.position > b.position ? 1 : -1)
    })
    subscription.on("delete", async parseObject => {
      const editedCard = await   this.toCard(parseObject)
      cardList.forEach((card, i) => {
        if (card.id === editedCard.id) {
          cardList.splice(i, 1)
        }
      })
      cardList.sort((a, b) => a.position > b.position ? 1 : -1)
    })
  }

  static async toCard(parseObject: Parse.Object): Promise<BoardCardInterface> {
    const checklists = await CardCheckListModel.getCheckList(parseObject.id);
    const cardLabels = await CardLabelModel.getCardLabel(parseObject.id);
    return {
      id: parseObject.id, createdAt: parseObject.createdAt, updatedAt: parseObject.updatedAt,
      checkLists: checklists,
      description: parseObject.get('description') ? parseObject.get('description') : '',
      dueDate: parseObject.get('dueDate') ? parseObject.get('dueDate') : undefined,
      labels: cardLabels,
      members: [],
      name: parseObject.get('name'),
      boardListId: parseObject.get('boardList').id,
      position: parseObject.get('sortOrder'),
    }
  }

  static async toMultipleCardList(parseCardList: Parse.Object[]) {
    const cardList: BoardCardInterface[] = []
    for (const parseObject of parseCardList) {
      cardList.push(await this.toCard(parseObject))
    }
    return cardList;
  }

  static async transferCard(itemId: string, listId: string, newPreviousId: string | undefined, newNextId: string | undefined) {
    await Parse.Cloud.run("moveBoardCard", {itemId, listId, newPreviousId, newNextId})
  }

  static async create(name: string, listId: string) {
    const newObject = new (Parse.Object.extend('ListCard'))();
    newObject.set('boardList', Parse.Object.extend('BoardList').createWithoutData(listId))
    newObject.set('name', name);
    return await newObject.save();
  }

  static async saveName(name: string, id: string) {
    const object = await new Parse.Query(Parse.Object.extend('ListCard')).get(id);
    object.set('name', name);
    return await object.save();
  }

  static async saveDescription(description: string, id: string) {
    const object = await new Parse.Query(Parse.Object.extend('ListCard')).get(id);
    object.set('description', description);
    return await object.save();
  }

  static async saveDate(dueDate: Date, id: string) {
    const object = await new Parse.Query(Parse.Object.extend('ListCard')).get(id);
    object.set('dueDate', dueDate);
    return await object.save();
  }
  static async removeDate(id: string) {
    const object = await new Parse.Query(Parse.Object.extend('ListCard')).get(id);
    object.set('dueDate', null);
    return await object.save();
  }
}

export interface BoardCardInterface {
  id?: string
  createdAt?: Date,
  updatedAt?: Date,
  name: string,
  dueDate?: Date,
  labels: CardLabelInterface[],
  description: string,
  checkLists: CardCheckListInterface[]
  members: UserInterface[]
  boardListId: string
  position: number
}
