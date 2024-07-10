import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-loading',
  template:`
 <div *ngIf="loading$ | async" class="loading">
      <div *ngIf="errorMessage" class="error">{{ errorMessage }}</div>
      <div *ngIf="!errorMessage">Loading...</div>
    </div>
`,
styles: [
  `
    .loading {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 9999;
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
      font-size: 2rem;
    }
    .error {
        color: red;
        font-size: 1.5rem;
        margin-bottom: 1rem;
      }
  `
]
})
export class LoadingComponent  {

  
  loading$: Observable<boolean>;
  errorMessage!: string;

  constructor(private loadingService: LoadingService) {
    this.loading$ = this.loadingService.loading$;
    this.loadingService.loading$.subscribe((loading:any) => {
      if (!loading) {
        this.errorMessage = this.loadingService.errorMessage;
        this.loadingService.clearError();
      }
    });
  }

}
