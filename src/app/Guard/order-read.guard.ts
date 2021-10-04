import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {CheckCurUserEventWriteAccess} from "../Util/shared";
import {AuthService} from "../Auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class OrderReadGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {
  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return await CheckCurUserEventWriteAccess(route.paramMap.get('eventId')!, route.data.access, this.router);
  }

}
