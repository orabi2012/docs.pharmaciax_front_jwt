import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute } from '@angular/router';
// import {
//   SocialAuthService,
//   GoogleLoginProvider,
//   FacebookLoginProvider,
// } from '@abacritt/angularx-social-login';
import { MessageService } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
// @ts-ignore
// import * as CryptoJS from 'crypto-js';
import { LoadingService } from 'src/app/services/loading.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService],
})
export class LoginComponent implements OnInit, OnDestroy {
  model: any = {};
  user: any;
  isForgotPassword = false;
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    // private googleService: SocialAuthService,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig,
    private loadingService: LoadingService,
    private route: ActivatedRoute, // Add this line
  ) { }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    // this.googleService.authState.subscribe((res:any) => {
    //   if (res) {
    //     this.user = res;
    //     console.log(this.user);

    //   }

    // });
    // Remove Google Ads when login page loads
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
    // Reinject Google Ads script when leaving login page
    const head = document.getElementsByTagName('head')[0];
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8400668080120923';
    script.crossOrigin = 'anonymous';
    head.appendChild(script);
  }

  toggleForgotPassword() {
    this.isForgotPassword = !this.isForgotPassword;
    this.model = { email: this.model.email }; // Keep email if entered
  }

  async forgotPassword() {
    if (!this.model.email) {
      this.messageService.add({
        key: 'tc',
        severity: 'error',
        summary: 'خطأ',
        detail: 'برجاء إدخال البريد الإلكتروني',
      });
      return;
    }

    this.loadingService.show();

    this.authService.forgotPassword(this.model.email).subscribe({
      next: (res: any) => {
        this.loadingService.hide();
        this.messageService.add({
          key: 'tc',
          severity: 'success',
          summary: 'تم بنجاح',
          detail: 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني',
        });
        this.toggleForgotPassword();
      },
      error: (error: any) => {
        this.loadingService.setError(error.message);
        this.loadingService.hide();
        this.messageService.add({
          key: 'tc',
          severity: 'error',
          summary: 'خطأ',
          detail: error?.error?.message || 'فشل في إرسال رابط إعادة التعيين',
        });
      },
    });
  }

  async login() {
    this.loadingService.show();

    // this.model.password = await CryptoJS.AES.encrypt(
    //   this.model.password,
    //   'postgress'
    // ).toString();

    this.authService.login(this.model).subscribe({
      next: (res: any) => {
        this.loadingService.hide();
        if (res) {
          this.user = res;
          if (this.user?.user_id != null) {
            // this.router.navigate(['/home']);
            const redirectUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
            this.router.navigate([redirectUrl]); // Use the captured return URL
          }
        } else {
          this.messageService.add({
            key: 'tc',
            severity: 'error',
            summary: 'error',
            detail: 'Something Went Wrong',
          });
        }
      },
      error: (error: any) => {
        this.loadingService.setError(error.message);
        this.loadingService.hide();

        this.messageService.add({
          key: 'tc',
          severity: 'error',
          summary: error.error.error || 're-check your email & password',
          detail: error?.error?.message,
        });
      },
    });
  }
  showSuccess() {
    this.messageService.add({
      key: 'tc',
      severity: 'success',
      summary: 'Success',
      detail: 'Message Content',
    });
  }

  // signInWithGoogle(): void {
  //   this.googleService.authState.subscribe((user: any) => {
  //     this.user = user;
  //     // console.log(this.user);

  //     if (this.user) {
  //       //call the backend from logginservice
  //       //this.authservice.login(user)
  //       this.router.navigate(['/home']);
  //     }
  //   });
  //   this.googleService.signIn(GoogleLoginProvider.PROVIDER_ID);
  // }
}
