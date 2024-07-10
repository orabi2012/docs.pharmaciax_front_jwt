import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { map, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private toastr:ToastrService,
    private cookieService:CookieService,
    private router:Router,
    private authService:AuthService){}
  canActivate(): boolean {
    const user = JSON.parse(this.cookieService.get('user')!)
      if (user && user.role_id != 1){
    
        this.toastr.error("for admin only");
        this.router.navigate(['/unAuthorized']);
        return false;
      }else{
        
         return true;
      }
    
  }
}
