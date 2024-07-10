import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserResolver implements Resolve<any> {
  constructor(private authService:AuthService){}
  resolve(route: ActivatedRouteSnapshot, ): Observable<boolean> {
    return this.authService.getUser(route.params["id"])
  }
}
