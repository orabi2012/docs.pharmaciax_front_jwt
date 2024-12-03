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
    private toastr: ToastrService, private cookieService: CookieService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    const isLoggedIn = this.checkUserLoggedIn();
    if (isLoggedIn) {
      // Check if the requested URL exists in your routes
      try {
        this.router.parseUrl(state.url);
        return true;
      } catch {
        // If URL parsing fails, redirect to home
        return this.router.createUrlTree(['/home']);
      }
    } else {
      this.toastr.error('YOU SHOULD LOGIN FIRST');
      return this.router.createUrlTree(['/login'], {
        queryParams: { returnUrl: state.url }
      });
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
