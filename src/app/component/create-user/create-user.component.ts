import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from 'src/app/services/category.service';


@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {
newUserForm:any;
countries:any;
imageUrl:any

  constructor(private router:Router, private fb:FormBuilder,
    private authService:AuthService,private toastr: ToastrService,
    private categoryService:CategoryService) { }

  ngOnInit(): void {
    this.newUserForm = this.fb.group({
      first_name:[""],
      last_name:[""],
      email:[""],
      password:[''],
      Country_id:[''],
        })
        
        this.categoryService.getCountries().subscribe((res:any)=>{
          this.countries= res
        })
  }

  set Country_id(val: number) {
    this.newUserForm.get('Country_id').setValue(val);
  }

  createUser(){
    const user = this.newUserForm.value
 
    this.authService.createuser(user).subscribe(res=>{
      this.toastr.success('User Added Successfully!', 'Success');
      this.router.navigate(['/adminPage'])
    },
    error=>{ (error?.error?.message) ? this.toastr.error(error?.error?.message, 'Error'):this.toastr.error('Something went wrong', 'Error') ;}
   // error=>{ this.toastr.error('Error In Creating User', 'Error');}

    )

  }
  cancel(){
    this.router.navigate(['/adminPage'])
  }

}
