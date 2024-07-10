import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router,
    private toastr:ToastrService,private cookieService:CookieService) {}
  // canActivate(): Observable<boolean> {
  //   return this.authService.currentUser$.pipe(
  //     map((user: any) => {
  //       if (user) {
  //         return true;
  //       } else {
  //         console.log("alooooooooooooo")
  //         this.toastr.error('YOU SHOULD LOGIN FIRST')
  //         this.router.navigate(['login']);
  //         return false;
  //       }
  //     })
  //   );
  // }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {

    const isLoggedIn = this.checkUserLoggedIn();
    if (isLoggedIn) {
      // User is logged in, allow navigation
      return true;
    } else {
      // User is not logged in, redirect to the login page
      return this.router.parseUrl('/login');
    }
  }

  private checkUserLoggedIn(): boolean {
    const token = this.cookieService.get('tokenJwt');
  
    try {
      if (token) {
        const parsedToken = JSON.parse(token);
        // Add your token validation logic here
        return !!parsedToken; // Return true if the token is valid, false otherwise
      }
    } catch (error) {
      console.error('Error parsing token:', error);
    }
  
    return false; // Return false if the token is not present or invalid
  }
  
}
