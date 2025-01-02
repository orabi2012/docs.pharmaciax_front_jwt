import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class RegisterComponent implements OnInit, OnDestroy {
  model: any = {};
  user: any;
  countries: any
  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig,
    private categoryService: CategoryService,
    private loadingService: LoadingService
  ) { }


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
    this.categoryService.getCountries().subscribe((res: any) => {
      this.loadingService.hide();
      this.countries = res
    })
    this.primengConfig.ripple = true;
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Record Saved',
    });
    // Remove Google Ads when register page loads
    const adScript = document.querySelector('script[src*="adsbygoogle"]');
    if (adScript) {
      adScript.remove();
    }
    // Hide any existing ad elements
    const adElements = document.querySelectorAll('.adsbygoogle');
    adElements.forEach(el => {
      (el as HTMLElement).style.display = 'none';
    });
  }

  ngOnDestroy() {
    // Reinject Google Ads script when leaving register page
    const head = document.getElementsByTagName('head')[0];
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8400668080120923';
    script.crossOrigin = 'anonymous';
    head.appendChild(script);
  }

  async register() {
    // console.log(this.model);
    // this.model.password = await CryptoJS.AES.encrypt(this.model.password, 'postgress').toString()
    this.authService.register(this.model).subscribe({
      next: (res: any) => {
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
      error: (error: any) => {
        // console.log(error);
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
