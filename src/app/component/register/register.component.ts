import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
// @ts-ignore
import * as CryptoJS from 'crypto-js';
import { CategoryService } from 'src/app/services/category.service';
import { LoadingService } from 'src/app/services/loading.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [MessageService],
})
export class RegisterComponent implements OnInit {
  model: any = {};
  user: any;
  countries:any
  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig,
    private categoryService:CategoryService,
    private loadingService:LoadingService
  ) {}

  
  showSuccess() {
    this.messageService.add({
      key: 'tc',
      severity: 'success',
      summary: 'Success',
      detail: 'Message Content',
    });
  }
  ngOnInit(): void {
    this.loadingService.show();
    this.categoryService.getCountries().subscribe((res:any)=>{
      this.loadingService.hide();
      this.countries = res
    })
    this.primengConfig.ripple = true;
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Record Saved',
    });
  }

  async register() {
    console.log(this.model);
    // this.model.password = await CryptoJS.AES.encrypt(this.model.password, 'postgress').toString()
    this.authService.register(this.model).subscribe({
      next: (res:any) => {
        this.loadingService.hide();
        this.user = res;
        this.messageService.add({
          key: 'tc',
          severity: 'success',
          summary: 'Success',
          detail: 'Message Content',
        });

        this.router.navigate(['/login']);
      },
      error: (error:any) => {
        console.log(error);
        this.messageService.add({
          key: 'tc',
          severity: 'error',
          summary: error.error.error,
          detail: error.error.message,
        });
      },
    });
  }
}
