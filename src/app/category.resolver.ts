import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { CategoryService } from './services/category.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryResolver implements Resolve<boolean> {
  constructor(private categoryService:CategoryService){}
  resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.categoryService.getCategories()
  }
}
