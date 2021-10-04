import * as Parse from "parse";
import {BudgetCheckListItemInterface, BudgetChecklistModel} from "./BudgetChecklistItem.model";

export class BudgetModel {

  static search(data: BudgetInterface, filter: string) {
    return data.name.toLocaleLowerCase().includes(filter) || data.source.toLocaleLowerCase().includes(filter) ||
      data.category.toLocaleLowerCase().includes(filter) || data.vendor.toLocaleLowerCase().includes(filter)
  }

  static async getBudgetById(budgetId: string) {
    return await this.toBudget(await (new Parse.Query(Parse.Object.extend('Budget'))).get(budgetId))
  }

  static async toBudget(parseObject: Parse.Object): Promise<BudgetInterface> {
    const checklist = await BudgetChecklistModel.getChecklist(parseObject);
    return {
      budgeted: parseObject.get('budget'), category: parseObject.get('category'),
      deadline: parseObject.get('deadline'), name: parseObject.get('name'), source: parseObject.get('source'),
      vendor: parseObject.get('vendor'), checklist: checklist
    }
  }

  static async save(budget: BudgetInterface, eventId: string) {
    let budgetObject;
    let isNew = false;
    if (budget.id)
      budgetObject = await new Parse.Query(Parse.Object.extend('Budget')).get(budget.id!);
    else{
      isNew = true;
      budgetObject = new (Parse.Object.extend('Budget'))();
    }
    budgetObject.set('source', budget.source);
    budgetObject.set('name', budget.name);
    budgetObject.set('category', budget.category);
    budgetObject.set('budget', budget.budgeted);
    budgetObject.set('deadline', budget.deadline);
    budgetObject.set('event', Parse.Object.extend('Event').createWithoutData(eventId))
    budgetObject = await budgetObject.save();
    if(isNew){
      const eventObject = Parse.Object.extend('Event').createWithoutData(eventId);
      eventObject.relation('budgets').add(budgetObject);
    }
    return budgetObject;
  }
}

export interface BudgetInterface {
  id?: string;
  updatedAt?: Date;
  createdAt?: Date;
  name: string;
  deadline: Date;
  source: string;
  category: string;
  budgeted: number;
  vendor: string;
  checklist: BudgetCheckListItemInterface[];
}
