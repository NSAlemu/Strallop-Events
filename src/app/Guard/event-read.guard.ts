import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {CheckCurUserEventWriteAccess} from "../Util/shared";
import {AuthService} from "../Auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class EventReadGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {
  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // @ts-ignore
    return await CheckCurUserEventWriteAccess(route.paramMap.get('eventId'), route.data.access, this.router);
  }
}

export enum RoleAccess {
  eventRead = 'eventRead', eventWrite = 'eventWrite', orderRead = 'orderRead',
  orderWrite = 'orderWrite', planningRead = 'planningRead', planningWrite = 'planningWrite'
  , roleReadWrite = 'roleReadWrite'
}
