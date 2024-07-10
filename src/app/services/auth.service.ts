import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserDetailsComponent } from '../component/user-details/user-details.component';
import { User } from '../interfaces/user';
import jwt_decode from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
private currentUserSource = new BehaviorSubject<any>(null);
currentUser$= this.currentUserSource.asObservable()
  constructor(private http:HttpClient, private cookieService:CookieService) { }

  getAll(){
    // return this.http.get('https://pharmaciax-api.onrender.com/users')
    return this.http.get(`${environment.base_url}`+"users")
  }
  getUser(id:any):Observable<any>{
    return this.http.get(`${environment.base_url}`+"user" + "/" + id)
  }

  createuser(user:any){
    return this.http.post(`${environment.base_url}`+"user/create",user)

  }
  updateUser(user:any):Observable<any>{
    return this.http.put(`${environment.base_url}`+"user/update" ,user).pipe(map(()=>user))
  }

  updatePassword(model:any) {
   
    return this.http.put(`${environment.base_url}`+'user/change-password', model);
  }
  

  login(model:any){
    return this.http.post(`${environment.base_url}`+"user/login",model)
    .pipe(map((res:any)=>{
      
      if(res && res.token){
        const tokenJwt = res.token
        this.cookieService.set('tokenJwt',JSON.stringify(tokenJwt),1,'/','',true, 'Strict');
        const user: User = jwt_decode(res.token);
       
        if(user){
        
          this.currentUserSource.next(user);
          this.cookieService.set('user', JSON.stringify(user), 1, '/', '', true, 'Strict');
         return user;
        }
        return null;
      }
      return null;
      
    })
  )};

  register(model:any){
    return this.http.post(`${environment.base_url}`+'user/create',model)
  }

  logout(){
    this.cookieService.delete('tokenJwt');
    this.cookieService.delete("user");
    this.currentUserSource.next(null)
  }

  setCurrentUser(user:any){
    this.currentUserSource.next(user)
  }
}
