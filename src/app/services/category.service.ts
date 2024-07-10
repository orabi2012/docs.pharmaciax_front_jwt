import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Category } from '../interfaces/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http:HttpClient) { }
  categories:any;
  countries:any;
 
  getCategories():Observable<any>{
    return this.http.get(`${environment.base_url}`+"CategoryList").pipe();
  }

  getCountries():Observable<any>{
    return this.http.get(`${environment.base_url}`+"countries").pipe();
  }
  getRoleId(){
    return this.http.get(`${environment.base_url}`+'roles').pipe();
  }

  getRoleById(id:any){
    return this.http.get(`${environment.base_url}`+'role' +'/' + id).pipe();
  }
}


