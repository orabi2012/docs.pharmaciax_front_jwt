import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { CategoryService } from 'src/app/services/category.service';


@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  userForm!: FormGroup;
  val: any;
  rolesId: any;
  countries: any;
  imageUrl: any;
  user: any
  constructor(private route: ActivatedRoute
    , private categoryService: CategoryService, private fb: FormBuilder,
    private router: Router, private authService: AuthService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      email: [{ value: '', disabled: true }],
      role_id: [""],
      Country_id: [""],
      isActive: ['']
    })

    this.categoryService.getRoleId().subscribe((res: any) => {
      this.rolesId = res
    })
    this.categoryService.getCountries().subscribe((res: any) => {
      this.countries = res
    })

    this.route.data.subscribe((data: any) => {
      // console.log(data)
      this.user = data['user'];
      this.userForm.patchValue({
        email: this.user.email,
        role_id: this.user.role_id,
        Country_id: this.user.Country_id,
        isActive: this.user.isActive
      }, { emitEvent: true });
      this.userForm.get('email')?.disable();
    })
    this.userForm.get('isactive')?.valueChanges.subscribe((value) => {
      const newValue = value === false ? 0 : 1;
      this.userForm.get('isactive')?.patchValue(newValue, { emitEvent: false });
    });
  }
  cancel() {
    this.router.navigate(['/adminPage'])
  }

  onSubmit() {

    const updatedUser = this.userForm.getRawValue()
    // console.log(updatedUser.email)
    this.authService.updateUser(updatedUser).subscribe(res => {
      this.toastr.success('User updated Successfully!', 'Success');
      this.router.navigate(['/adminPage'])
    },
      error => { this.toastr.error('Error In Updating User', 'Error'); })
  }
  onImageUpload(event: any) {
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (e: any) => {
      this.imageUrl = e.target.result;
    };
  }
}
