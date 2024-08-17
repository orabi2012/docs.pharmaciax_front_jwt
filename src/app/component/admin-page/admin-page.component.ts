import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {
  users: any
  imageUrl: any
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.getAll().subscribe({
      next: (res: any) => {
        this.users = res;
        // console.log(this.users)
      },
      error: (error: any) => console.log(error)
    })

  }

}
