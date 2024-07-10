import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
@Injectable()
export class UnauthInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap(response => {
        console.log("repsponse interceptor",response);
      }),
      catchError(error => {
         if (error.status === 401) {
          // Unauthorized access, redirect to login page
          this.router.navigate(['/login']);
        }
        return throwError(error);

      })
    );
    // return next.handle(request).pipe(
    //   catchError((error: HttpErrorResponse) => {
    //     if (error.status === 401) {
    //       // Unauthorized access, redirect to login page
    //       this.router.navigate(['/login']);
    //     }
    //     return throwError(error);
    //   })
    // );
  }
}
