import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {
  users: any[] = []
  imageUrl: any
  totalVisits: number = 0;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.getAll().subscribe({
      next: (res: any) => {
        this.users = res;
        this.totalVisits = this.users.reduce((sum, user) => sum + (user.visits || 0), 0);
        // console.log(this.users)
      },
      error: (error: any) => console.log(error)
    })

  }

}
