import * as Parse from "parse";

export class BudgetChecklistModel {

  static async getChecklist(parseObject: Parse.Object) {
    return await this.toBudgetChecklist(await parseObject.relation('checklist').query().find());
  }

  static async toBudgetChecklist(parseObjects: Parse.Object[]) {
    const checklist: BudgetCheckListItemInterface[] = [];
    for (const parseObject of parseObjects) {
      checklist.push(await this.toBudgetChecklistItem(parseObject))
    }
    return checklist;
  }

  static async toBudgetChecklistItem(parseObject: Parse.Object): Promise<BudgetCheckListItemInterface> {
    const checklist = await BudgetChecklistModel.getChecklist(parseObject);
    return {
      isPositive: parseObject.get('isPositive'),
      notes: parseObject.get('notes') ? parseObject.get('notes') : "",
      completed: parseObject.get('completed'),
      createdAt: parseObject.createdAt,
      description: parseObject.get('description') ? parseObject.get('description') : "",
      id: parseObject.id,
      position: parseObject.get('sortOrder'),
      updatedAt: parseObject.updatedAt
    }
  }

  static async moveItem(itemId: string, listId: string, newPreviousId: string | undefined, newNextId: string | undefined) {
    await Parse.Cloud.run("moveBudgetChecklistItem", {itemId, listId, newPreviousId, newNextId})
  }

  static async deleteItem(id: string) {
    return await Parse.Object.extend('BudgetChecklistItem').createWithoutData(id).destroy()
  }

  static async saveDescription(description: string, id: string) {
    const object = await new Parse.Query(Parse.Object.extend('BudgetChecklistItem')).get(id);
    object.set('description', description);
    return await object.save();
  }

  static async create(description: string, id: string) {
    const newObject = new (Parse.Object.extend('BudgetChecklistItem'))();
    newObject.set('budget', Parse.Object.extend('Budget').createWithoutData(id))
    newObject.set('description', description);
    const obj = await newObject.save();
    const budgetObject = (await new Parse.Query(Parse.Object.extend('Budget')).get(id));
    budgetObject.relation('checklist').add(newObject)
    budgetObject.save();
    return obj;
  }

  static async setCompleted(completed: boolean, id: string) {
    const object = await new Parse.Query(Parse.Object.extend('BudgetChecklistItem')).get(id);
    object.set('completed', completed);
    return await object.save();
  }

  static async setNotes(notes: String, isPositive: boolean, id: string) {
    const object = await new Parse.Query(Parse.Object.extend('BudgetChecklistItem')).get(id);
    object.set('notes', notes);
    object.set('isPositive', isPositive);
    return await object.save();
  }
}

export interface BudgetCheckListItemInterface {
  id?: string
  createdAt?: Date,
  updatedAt?: Date,
  description: string,
  completed: boolean;
  position: number;
  notes: string;
  isPositive: boolean;
}
