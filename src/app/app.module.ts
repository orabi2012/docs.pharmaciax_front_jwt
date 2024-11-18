import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule, Meta } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { HomeComponent } from './component/home/home.component';
import { ForgotPasswordComponent } from './component/forgot-password/forgot-password.component';
import {
  SocialLoginModule,
  SocialAuthServiceConfig,
} from '@abacritt/angularx-social-login';
import {
  GoogleLoginProvider,
  FacebookLoginProvider
} from '@abacritt/angularx-social-login';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminPageComponent } from './component/admin-page/admin-page.component';
import { UserDetailsComponent } from './component/user-details/user-details.component';
import { CreateFileComponent } from './component/create-file/create-file.component';
import { CreateUserComponent } from './component/create-user/create-user.component';
import { UnauthorizedComponent } from './errors/unauthorized/unauthorized.component';
import { ModalComponent } from './component/modal/modal.component';
import { LoadingInterceptor } from './loading.interceptor';
import { LoadingComponent } from './component/loading/loading.component';
import { FileDetailsComponent } from './component/file-details/file-details.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxEditorModule } from 'ngx-editor';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UpdateFileComponent } from './component/update-file/update-file.component';
import { ChangePasswordComponent } from './component/change-password/change-password.component';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe } from '@angular/common';
import { QuillModule } from 'ngx-quill';
import { ConfirmationDialogComponent } from './component/confirmation-dialog/confirmation-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { PDFDocumentProxy } from 'ngx-extended-pdf-viewer';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { JwtInterceptorService } from './jwt-interceptor.service';
import { UnauthInterceptor } from './unauth.interceptor';
import { ResetPasswordComponent } from './component/reset-password/reset-password.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ForgotPasswordComponent,
    AdminPageComponent,
    UserDetailsComponent,
    CreateFileComponent,
    CreateUserComponent,
    UnauthorizedComponent,
    ModalComponent,
    LoadingComponent,
    FileDetailsComponent,
    UpdateFileComponent,
    ChangePasswordComponent,
    ConfirmationDialogComponent,
    ResetPasswordComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SocialLoginModule,
    ToastModule,
    CalendarModule,
    CommonModule,
    NgSelectModule,
    BrowserAnimationsModule,
    PdfViewerModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatButtonModule,
    NgxEditorModule,
    MatDialogModule,
    MatSelectModule,
    MatIconModule,
    NgxExtendedPdfViewerModule,
    QuillModule.forRoot(),
    ToastrModule.forRoot(
      {
        timeOut: 10000,
        positionClass: 'toast-top-center',
        preventDuplicates: true,
      }
    )

  ],
  providers: [Meta,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              "966626020382-4smb7gmpsbhhr6gt39bc5c1mjr95ee35.apps.googleusercontent.com")
          },
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    },
    MessageService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UnauthInterceptor,
      multi: true
    },
    DatePipe,

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
