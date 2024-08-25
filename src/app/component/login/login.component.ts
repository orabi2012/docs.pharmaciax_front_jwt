import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
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
export class LoginComponent implements OnInit {
  model: any = {};
  user: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    // private googleService: SocialAuthService,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig,
    private loadingService: LoadingService
  ) { }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    // this.googleService.authState.subscribe((res:any) => {
    //   if (res) {
    //     this.user = res;
    //     console.log(this.user);

    //   }

    // });
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
            this.router.navigate(['/home']);
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
