import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, finalize, map, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { LoadingService } from './services/loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  constructor(private loadingService: LoadingService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    this.loadingService.show();
    return next.handle(request).pipe(
      //tap((res:any)=>console.log(res)),
      catchError((error: HttpErrorResponse) => {
        this.loadingService.hide();
        this.loadingService.setError(error.message);
        return throwError(error);
      }),
      finalize(() => {
        this.loadingService.hide();
      })
    );
  }
}
