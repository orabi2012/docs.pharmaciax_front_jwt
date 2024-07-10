import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'pharmaceuticalPuplications';

  constructor(private authService:AuthService,
    private cookieService:CookieService,
    private router:Router){

  }
  ngOnInit(): void {
    this.setCurrentUser()

  }
  setCurrentUser(){
    const userString = this.cookieService.get('user');
    if(!userString) return
        
      const user = JSON.parse(userString)
    this.authService.setCurrentUser(user)
    }    
  }

