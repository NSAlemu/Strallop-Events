import {MatSnackBar} from '@angular/material/snack-bar';
import {DatePipe} from '@angular/common';
import {Router} from "@angular/router";
import * as Parse from 'parse';
import {RolesModel, RolesModelInterface} from "../../Models/Roles.model";
import {RoleAccess} from "../Guard/event-read.guard";
import {AddressInterface} from "../../Models/Address.model";

export function AlertSnackBar(snackBar: MatSnackBar, success: boolean, message: string) {
  snackBar.open(message, undefined, {
    duration: 3000,
    panelClass: success ? ['custom-success-snackbar'] : ['custom-failure-snackbar']
  });
}

export function GetMonth(date: Date): string | null {
  return new DatePipe('en-US').transform(date, 'MMM');
}

export function GetDay(date: Date): string | null {
  return new DatePipe('en-US').transform(date, 'dd');
}

export function GetTime(date: Date): string | null {
  const pipe = new DatePipe('en-US');
  return pipe.transform(date, 'hh:mm a');
}

export function GetCompactDate(date: Date): string | null {
  const pipe = new DatePipe('en-US');
  return pipe.transform(date, 'dd/MM/yy');
}

export function GetCompactFullDate(date: Date): string | null {
  const pipe = new DatePipe('en-US');
  return pipe.transform(date, 'dd/MM/yy HH:mm:ss:SS');
}

export function GetDate(date: Date): string | null {
  const pipe = new DatePipe('en-US');
  return pipe.transform(date, 'EEEE, MMMM dd, YYYY');
}


export function GetFullDate(date: Date): string | null {
  const pipe = new DatePipe('en-US');
  return `${pipe.transform(date, 'EEEE, MMMM dd, YYYY')} at ${pipe.transform(date, 'hh:mm a')}`;
}

export function FormatAddress(address: AddressInterface) {
  let formattedAddress = '';
  formattedAddress +=  address.name  && address.name.length > 0 ? address.name : ''
  formattedAddress += formattedAddress.length > 0  && address.address1 && address.address1.length > 0 ? ', ' : ''

  formattedAddress += address.address1.length > 0 ? address.address1 : ''
  formattedAddress += formattedAddress.length > 0  && address.address2 && address.address2.length > 0 ? ', ' : ''

  formattedAddress += address.address2.length > 0 ? address.address2 : ''
  formattedAddress += formattedAddress.length > 0 && address.city && address.city.length > 0 ? ', ' : ''

  formattedAddress += address.city.length > 0 ? address.city : ''
  formattedAddress += formattedAddress.length > 0 && address.country && address.country.length > 0 ? ', ' : ''

  formattedAddress += address.country && address.country.length > 0   ? address.country : ''

  return formattedAddress;
}

export function ErrorCatcher(router: Router, reason: any) {
  switch (reason.code) {
    case Parse.Error.CONNECTION_FAILED:
      router.navigateByUrl('/server-error');
      break;
    case Parse.Error.OBJECT_NOT_FOUND:
      router.navigateByUrl('/Not-Found');

  }

}

export async function CheckCurUserEventWriteAccess(eventId: string, access: RoleAccess, router: Router): Promise<boolean> {
  // @ts-ignore
  return await RolesModel.getUserEventRole(Parse.User.current().id, eventId).then(value => {
    if (value instanceof Parse.Error) {
      ErrorCatcher(router, value);
      return false;
    } else {
      if (!value[access]) {
        router.navigateByUrl('/m/events/' + eventId);
        return false;
      } else {
        return true;
      }
    }
  })
}

export async function CheckCurUserOrderReadAccess(eventId: string, router: Router): Promise<boolean> {
  // @ts-ignore
  return await RolesModel.getUserEventRole(Parse.User.current().id, eventId).then(value => {
    if (value instanceof Parse.Error) {
      ErrorCatcher(router, value);
      return false;
    } else {
      if (!value.orderRead) {
        router.navigateByUrl('/events/' + eventId);
        return false;
      } else {
        return true;
      }
    }
  })
}
// export const serverLocation = 'http://localhost:1337'
export const serverLocation = 'https://strallop.herokuapp.com'
// export const serverLocation = 'https://parseapi.back4app.com'
