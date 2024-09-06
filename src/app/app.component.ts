import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './services/auth.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'pharmaceuticalPuplications';

  constructor(private authService: AuthService,
    private cookieService: CookieService,
    private router: Router,
    private metaService: Meta,
    private titleService: Title
  ) {

  }
  ngOnInit(): void {
    this.setCurrentUser()
    this.updateMetaTags()


  }
  setCurrentUser() {
    const userString = this.cookieService.get('user');
    if (!userString) return

    const user = JSON.parse(userString)
    this.authService.setCurrentUser(user)
  }

  private updateMetaTags(): void {
    const title = 'Docs.pharmaciax.com';
    const description = "";
    const imageUrl = "https://docs.pharmaciax.com/assets/img/logos/logo3.png";
    const url = `https://docs.pharmaciax.com`;

    this.titleService.setTitle(title); // <-- Set the page title

    this.metaService.addTag({ name: 'description', content: description }); // <-- Update description
    this.metaService.addTag({ property: 'og:title', content: title }); // <-- Update OG title
    this.metaService.addTag({ property: 'og:description', content: description }); // <-- Update OG description
    this.metaService.addTag({ property: 'og:image', content: imageUrl }); // <-- Update OG image
    this.metaService.addTag({ property: 'og:url', content: url }); // <-- Update OG URL
    this.metaService.addTag({ property: 'og:type', content: 'website' }); // <-- Set OG type



  }
}

