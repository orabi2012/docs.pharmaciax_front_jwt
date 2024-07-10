import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Category, Subcategories } from 'src/app/interfaces/category';
import { CategoryService } from 'src/app/services/category.service';
import { FileService } from 'src/app/services/file.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
// import { QuillModule } from 'ngx-quill';
import Quill from 'quill';
import BlotFormatter from 'quill-blot-formatter';
import { CookieService } from 'ngx-cookie-service';
import { File } from 'src/app/interfaces/file';

Quill.register('modules/blotFormatter', BlotFormatter);

@Component({
  selector: 'app-create-file',
  templateUrl: './create-file.component.html',
  styleUrls: ['./create-file.component.css'],
})
export class CreateFileComponent implements OnInit {
  userId!: number;
  fileForm!: FormGroup;
  categories!: Category[];
  countries: any;
  selectedCategory: any;
  subCategoriesArr!: Subcategories[];
  allStatus: any;
  filePath: any;
  quillEditorModules = {};
  submitted = false;
  yearInput: any;
  currentYear: number = new Date().getFullYear();

  get f() {
    return this.fileForm.controls;
  }

  constructor(
    private fb: FormBuilder,
    private cookieService: CookieService,
    private fileService: FileService,
    private categoryService: CategoryService,
    private toastr: ToastrService,
    private router: Router
  ) {
    // this.years = this.getYearList();

    this.quillEditorModules = {
      blotFormatter: {},
    };
  }

  ngOnInit(): void {
    const userlogged = JSON.parse(this.cookieService.get('user')!);
    this.userId = userlogged.user_id;
    this.fileForm = this.fb.group({
      file_name: ['', [Validators.required, Validators.minLength(3)]],
      Doc_No: ['', Validators.required],
      Year: ['', Validators.required],
      txt_Ar: [''],
      txt_Eng: [''],
      Country_id: ['', Validators.required],
      Category_id: ['', Validators.required],
      subCategories: [[], Validators.required],
      createdByID: [this.userId],
      UpdatedbyID: [this.userId],
      file: ['', Validators.required],
      status_id: ['', Validators.required],
      file_desc: [''],
      isAuthorized: [false],
    });

    const isAuthorizedControl = this.fileForm.get('isAuthorized');

    // Set the initial value of isAuthorized to 1
    isAuthorizedControl?.setValue(false);
    this.categoryService.getCategories().subscribe((res: any) => {
      this.categories = res;
    });
    this.categoryService.getCountries().subscribe((res: any) => {
      this.countries = res;
    });
    this.fileService.getFileStatus().subscribe((res: any) => {
      this.allStatus = res;
    });
  }

  onImageChangeFromFile(event: any) {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    if (file.type !== 'application/pdf') {
      this.fileForm.reset();
      this.fileForm.get('file')?.setValidators([Validators.required]);
      this.fileForm.get('file')?.updateValueAndValidity();
    } else {
      const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB in bytes
      if (file.size > MAX_FILE_SIZE) {
        this.fileForm.reset();
        this.fileForm
          .get('file')
          ?.setValidators([Validators.required, Validators.max(MAX_FILE_SIZE)]);
        this.fileForm.get('file')?.updateValueAndValidity();
      } else {
        this.fileForm.get('file')?.clearValidators();
        this.fileForm.get('file')?.updateValueAndValidity();
        this.filePath = file;
      }
    }
  }

  cancel() {
    this.router.navigate(['/home']);
  }

  onChange() {
    for (const c of this.categories) {
      if (c.cat_id === this.selectedCategory) {
        this.subCategoriesArr = c.subcategories;
      }
    }
  }
  onIsAuthorizedChange(event: Event) {
    const isAuthorizedControl = this.fileForm.get('isAuthorized');
    const isChecked = (event.target as HTMLInputElement).checked;
    isAuthorizedControl?.setValue(isChecked ? true : false);
    if (!isChecked) {
      isAuthorizedControl?.setValue(false);
    }
  }

  @ViewChild('fileInput') fileInput!: ElementRef;
  onFileUpload() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.fileForm.invalid) {
      return;
    }
    if (this.submitted) {
      let subCategories = this.fileForm.get('subCategories')?.value;
      let objects = subCategories.map((item: any) => {
        return { subcat_id: item };
      });
      this.fileForm.get('subCategories')?.setValue(JSON.stringify(objects));

      let year = this.fileForm.get('Year')!.value;
      let dateString = year
        ? new Date(year).getFullYear()
        : new Date().getFullYear();
      this.yearInput = this.fileForm.get('Year')!.setValue(dateString);

      const formData = new FormData();
      formData.append('file', this.filePath);
      formData.append('file_name', this.fileForm.get('file_name')?.value);
      formData.append('Doc_No', this.fileForm.get('Doc_No')?.value);
      formData.append('Year', this.fileForm.get('Year')?.value);
      formData.append('txt_Ar', this.fileForm.get('txt_Ar')?.value);
      formData.append('txt_Eng', this.fileForm.get('txt_Eng')?.value);
      formData.append('Country_id', this.fileForm.get('Country_id')?.value);
      formData.append('isAuthorized', this.fileForm.get('isAuthorized')?.value);
      formData.append('Category_id', this.fileForm.get('Category_id')?.value);
      formData.append(
        'subCategories',
        this.fileForm.get('subCategories')?.value
      );
      formData.append('status_id', this.fileForm.get('status_id')?.value);
      formData.append('file_desc', this.fileForm.get('file_desc')?.value);
      // formData.append('userID', this.fileForm.get('createdByID')?.value);

      this.fileService.createFile(formData).subscribe(
        (result: File) => {
          this.toastr.success(result?.message, 'Success');
          const fileId = result?.CreatedfileData?.File_data_id;
          this.router.navigate(['/file_details', fileId]);
        },
        (error) => {
          if (error?.error?.message) {
            this.toastr.error(error?.error?.message, 'Error');
            this.fileForm.get('Year')?.setValue('');
          } else {
            this.fileForm.get('Year')?.setValue('');
            this.toastr.error('Something went wrong', 'Error');
          }
        }
      );
    }
  }
}
