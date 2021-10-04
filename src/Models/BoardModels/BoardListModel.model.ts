import {BoardCardInterface, BoardCardModel} from "./BoardCardModel.model";
import * as Parse from 'parse'

export class BoardListModel {

  static async toBoardList(parseObject: Parse.Object, cards: BoardCardInterface[]): Promise<BoardListInterface> {
    return {
      id: parseObject.id, createdAt: parseObject.createdAt, updatedAt: parseObject.updatedAt,
      cards, name: parseObject.get('name'), position: parseObject.get('sortOrder')
    }
  }

  static async toMultipleBoardList(parseObjects: Parse.Object[],): Promise<BoardListInterface[]> {
    const boardList: BoardListInterface[] = []
    for (const parseObject of parseObjects) {
      const cards = await BoardCardModel.getCards(parseObject.id);
      boardList.push(await this.toBoardList(parseObject, cards))
    }
    return boardList;
  }

  static async getBoardListForEvent(eventId: string): Promise<BoardListInterface[]> {
    const boardList: BoardListInterface[] = []
    const query = new Parse.Query(Parse.Object.extend('BoardList'))
      .notEqualTo('archived', true)
      .equalTo('event', Parse.Object.extend('Event').createWithoutData(eventId));

    this.subscriptionHandler(await query.subscribe(), boardList);
    const parseBoardList = await query.find();
    boardList.push(...(await this.toMultipleBoardList(parseBoardList)));
    boardList.sort((a, b) => a.position > b.position ? 1 : -1)

    return boardList;
  }

  private static subscriptionHandler(subscription: Parse.LiveQuerySubscription, boardList: BoardListInterface[]) {
    subscription.on("create", async newBoardList => {
      const cards = await BoardCardModel.getCards(newBoardList.id);
      const createdCard = await this.toBoardList(newBoardList, cards)
      boardList.splice(createdCard.position, 0, createdCard)
      boardList.sort((a, b) => a.position > b.position ? 1 : -1)
    })
    subscription.on("update", async editedBoardlist => {
      const cards = await BoardCardModel.getCards(editedBoardlist.id);
      const editedBoardList = await this.toBoardList(editedBoardlist, cards)
      boardList.forEach((card, i) => {
        if (card.id === editedBoardlist.id) {
          boardList.splice(i, 1, editedBoardList)
        }
      })
      boardList.sort((a, b) => a.position > b.position ? 1 : -1)
    })
    subscription.on("delete", parseObject => {
      console.log("item deleted")
      boardList.forEach((card, i) => {
        if (card.id === parseObject.id) {
          boardList.splice(i, 1)
        }
      })
      boardList.sort((a, b) => a.position > b.position ? 1 : -1)
    })
    subscription.on("leave", parseObject => {
      console.log("item left")
      boardList.forEach((card, i) => {
        if (card.id === parseObject.id) {
          boardList.splice(i, 1)
        }
      })
      boardList.sort((a, b) => a.position > b.position ? 1 : -1)
    })
    subscription.on("enter", async newBoardList => {
      console.log("item enter")
      const cards = await BoardCardModel.getCards(newBoardList.id);
      const createdCard = await this.toBoardList(newBoardList, cards)
      boardList.splice(createdCard.position, 0, createdCard)
      boardList.sort((a, b) => a.position > b.position ? 1 : -1)
    })
  }

  static async transferCard(itemId: string, newPreviousId: string | undefined, newNextId: string | undefined) {
    await Parse.Cloud.run("moveBoardList", {itemId, newPreviousId, newNextId})
  }

  static async create(name: string, eventId: string) {
    const newObject = new (Parse.Object.extend('BoardList'))();
    newObject.set('event', Parse.Object.extend('Event').createWithoutData(eventId))
    newObject.set('name', name);
    return await newObject.save();
  }

  static async archive(id: string) {
    const object = await new Parse.Query(Parse.Object.extend('BoardList')).get(id);
    object.set('archived', true);
    return await object.save();
  }

  static async saveName(name: string, id: string) {
    const object = await new Parse.Query(Parse.Object.extend('BoardList')).get(id);
    object.set('name', name);
    return await object.save();
  }
}

export interface BoardListInterface {
  id?: string
  createdAt?: Date,
  updatedAt?: Date,
  name: string,
  cards: BoardCardInterface[],
  position: number
}
