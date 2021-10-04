import {BoardListInterface} from "./BoardListModel.model";
import {CardLabelInterface, ColorEnum} from "./CardLabelModel.model";

export class BoardModel {
  static toBoard() {

  }

  static getAllLabels(): CardLabelInterface[] {
    return [{id: '1', color: ColorEnum.blue, label: ''}, {color: ColorEnum.cyan, label: ''},
      {id: '2', color: ColorEnum.red, label: ''}, {id: '3', color: ColorEnum.green, label: ''}, {
        id: '4',
        color: ColorEnum.orange,
        label: ''
      },
      {id: '5', color: ColorEnum.purple, label: ''}, {id: '6', color: ColorEnum.yellow, label: ''}, {
        id: '7',
        color: ColorEnum.pink,
        label: ''
      }]
  }


}

export interface BoardInterface {
  id?: string
  createdAt?: Date,
  updatedAt?: Date,
  name: string,
  boardList: BoardListInterface[]
  eventId: string
}
