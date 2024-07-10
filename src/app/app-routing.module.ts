import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryResolver } from './category.resolver';
import { AdminPageComponent } from './component/admin-page/admin-page.component';
import { ChangePasswordComponent } from './component/change-password/change-password.component';
import { CreateFileComponent } from './component/create-file/create-file.component';
import { CreateUserComponent } from './component/create-user/create-user.component';
import { FileDetailsComponent } from './component/file-details/file-details.component';
import { ForgotPasswordComponent } from './component/forgot-password/forgot-password.component';
import { HomeComponent } from './component/home/home.component';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { UpdateFileComponent } from './component/update-file/update-file.component';
import { UserDetailsComponent } from './component/user-details/user-details.component';
import { UnauthorizedComponent } from './errors/unauthorized/unauthorized.component';
import { FileDetailsResolver } from './file-details.resolver';
import { FilesResolver } from './files.resolver';
import { AdminGuard } from './guard/admin.guard';
import { AuthGuard } from './guard/auth.guard';
import { UserResolver } from './user.resolver';

const routes: Routes = [
  {path:'',component:LoginComponent},
  {path:'login',component:LoginComponent},
  {path:'register',component:RegisterComponent},
  {path:'home',component:HomeComponent,canActivate:[AuthGuard],
  resolve:{category:CategoryResolver,files:FilesResolver}},
  {path:'file_details/:id', component:FileDetailsComponent,resolve:{file:FileDetailsResolver},
  canActivate:[AuthGuard]},
  {path:'update_file/:id', component:UpdateFileComponent,
   resolve:{files:FilesResolver},canActivate:[AuthGuard]},
  {path:'createFile',component:CreateFileComponent,canActivate:[AuthGuard,AdminGuard],
    resolve:{category:CategoryResolver}},
  {path:'forgot-password',component:ForgotPasswordComponent},
  {path:'adminPage',component:AdminPageComponent,canActivate:[AuthGuard,AdminGuard]},
  {path:'change_password',component:ChangePasswordComponent,canActivate:[AuthGuard]},
  {path:'createUser',component:CreateUserComponent,canActivate:[AuthGuard,AdminGuard]},
  {path:"user_details/:id",component:UserDetailsComponent,
  canActivate:[AuthGuard,AdminGuard],resolve:{user:UserResolver}},
  {path:"unAuthorized",component:UnauthorizedComponent},
  { path: '**', redirectTo: '' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
