import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { switchMap } from 'rxjs';
import { Subcategories } from 'src/app/interfaces/category';
import { CategoryService } from 'src/app/services/category.service';
import { FileService } from 'src/app/services/file.service';
import Quill from 'quill';
import BlotFormatter from 'quill-blot-formatter';
import { CookieOptions, CookieService } from 'ngx-cookie-service';
import { DatePipe } from '@angular/common';

Quill.register('modules/blotFormatter', BlotFormatter);

@Component({
  selector: 'app-update-file',
  templateUrl: './update-file.component.html',
  styleUrls: ['./update-file.component.css'],
})
export class UpdateFileComponent implements OnInit {
  countries: any;
  categories: any;
  selectedCategory: any;
  allStatus: any;
  fileForm!: FormGroup;
  subCategoriesArr!: Subcategories[];
  subCatModel!: Subcategories[];
  userId: any;
  fileId: any;
  allFiles: any;
  file: any;
  filePath: any;
  subObj: any;
  pdfUrl: any;
  filePathString: any;
  quillEditorModules = {};
  pdfLoading: boolean = true;
  createdAtFormatted: any;
  updatedAtFormatted: any;
  @ViewChild('fileInput') fileInput!: ElementRef;
  datePipe = new DatePipe('en-US');
  get f() {
    return this.fileForm.controls;
  }

  constructor(
    private categoryService: CategoryService,
    private cookieService: CookieService,
    private fileService: FileService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer
  ) {
    //   this.quillEditorModules = {
    //    toolbar:[
    //      [{'font':[]}],
    //      ['bold','italic','underline'],
    //      [{'list':'ordered'},{'list':'bullet'}],
    //      [{'color':[]},{'background':[]}],
    //      ['link','image']
    //    ],
    //    blotFormatter: {}
    //  }
    this.quillEditorModules = {
      blotFormatter: {},
    };
  }

  ngOnInit(): void {
    const userlogged = JSON.parse(this.cookieService.get('user')!);
    this.userId = userlogged.user_id;
    this.fileForm = this.fb.group({
      File_data_id: [''],
      file_name: ['', [Validators.required, Validators.minLength(3)]],
      Doc_No: ['', Validators.required],
      Year: ['', Validators.required],
      txt_Ar: [''],
      txt_Eng: [''],
      fileID: [''],
      Country_id: ['', Validators.required],
      Category_id: ['', Validators.required],
      subCategories: [[], Validators.required],
      createdByID: [this.userId],
      UpdatedbyID: [this.userId],
      createdAt: [''],
      updatedAt: [''],
      status_id: ['', Validators.required],
      file_desc: [''],
      isAuthorized: [''],
      isActive: [''],
    });

    this.createdAtFormatted = this.datePipe.transform(
      this.file?.data?.createdAt,
      'dd/MM/yyyy'
    );
    this.updatedAtFormatted = this.datePipe.transform(
      this.file?.data?.updatedAt,
      'dd/MM/yyyy'
    );

    this.categoryService.getCategories().subscribe((res: any) => {
      this.categories = res;
    });

    this.categoryService.getCountries().subscribe((res: any) => {
      this.countries = res;
    });
    this.fileService.getFileStatus().subscribe((res: any) => {
      this.allStatus = res;
    });
    this.fileId = this.route.snapshot.paramMap.get('id');

    this.fileService.getFile(this.fileId).subscribe((res: any) => {
      this.file = res;
      this.pdfLoading = true;
      const filePathString = this.file?.data?.fileID;

      const url = `https://pharmaciax-api.onrender.com/apigoogle/${filePathString}`;
      this.fileService.getFileFromGoogle(url).subscribe((blob: BlobPart) => {
        const pdfBlob = new Blob([blob], { type: 'application/pdf' });
        const file = new File([blob], '', { type: 'application/pdf' });
        const reader = new FileReader();
        reader.onload = () => {
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          const fileList = dataTransfer.files;
          this.fileInput.nativeElement.value = '';
          this.fileInput.nativeElement.files = fileList;

          //   console.log(this.file.data)
        };
        reader.readAsDataURL(file);

        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          URL.createObjectURL(pdfBlob)
        );
        this.pdfLoading = false;
      });

      this.subCategoriesArr = this.file.data?.subCategories;

      const subCategoryIds = this.subCategoriesArr.map(
        (subCategory) => subCategory.subcat_id
      );

      this.fileForm.patchValue(
        {
          file_name: this.file.data?.file_name,
          Year: this.file.data?.Year,
          Doc_No: this.file.data?.Doc_No,
          txt_Ar: this.file.data?.txt_Ar,
          txt_Eng: this.file.data?.txt_Eng,
          Country_id: this.file.data?.Country.id,
          Category_id: this.file.data?.Category.cat_id,
          status_id: this.file.data?.file_data_status.status_id,
          subCategories: subCategoryIds,
          file_desc: this.file?.data?.file_desc,
          isAuthorized: this.file?.data?.isAuthorized,
          isActive: this.file?.data?.isactive,
          createdByID: `${this.file?.data?.createdBy?.first_name} ${this.file?.data?.createdBy?.last_name}`,
          UpdatedbyID: `${this.file?.data?.updatedBy.first_name} ${this.file?.data?.updatedBy.last_name}`,
          createdAt: this.datePipe.transform(
            this.file?.data?.createdAt,
            'dd/MM/yyyy'
          ),
          updatedAt: this.datePipe.transform(
            this.file?.data?.updatedAt,
            'dd/MM/yyyy'
          ),
        },
        { emitEvent: true }
      );
    });
    // console.log('DATAAAAAAAAAAAAAAAAAAAAAAaa');
    console.log(this.file?.data);
  }
  onImageChangeFromFile(event: any) {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    if (file.type !== 'application/pdf') {
      this.fileForm.reset();
      this.fileForm.get('fileID')?.setValidators([Validators.required]);
      this.fileForm.get('fileID')?.updateValueAndValidity();
    } else {
      const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB in bytes
      if (file.size > MAX_FILE_SIZE) {
        this.fileForm.reset();
        this.fileForm
          .get('fileID')
          ?.setValidators([Validators.required, Validators.max(MAX_FILE_SIZE)]);
        this.fileForm.get('fileID')?.updateValueAndValidity();
      } else {
        this.fileForm.get('fileID')?.clearValidators();
        this.fileForm.get('fileID')?.updateValueAndValidity();
        this.filePath = file;
      }
    }
  }

  onChange() {
    for (const c of this.categories) {
      if (c.cat_id === this.selectedCategory) {
        this.subCategoriesArr = c.subcategories;
        const subCategoryIds = this.subCategoriesArr.map(
          (subCategory) => subCategory.subcat_id
        );
        this.fileForm.patchValue({ subCategories: subCategoryIds });
      }
    }
  }

  update() {
    let year = this.fileForm.get('Year')!.value;
    let dateString = new Date(year).getFullYear();
    this.fileForm.get('Year')!.setValue(dateString);

    let subCategories = this.fileForm.get('subCategories')?.value;
    console.log(subCategories);
    let objects = subCategories.map((item: any) => {
      return { subcat_id: item };
    });
    this.fileForm.get('subCategories')?.setValue(JSON.stringify(objects));

    // const fileInput = this.fileInput?.nativeElement;
    // if (fileInput.files && fileInput.files[0]) {
    //    this.filePath = fileInput.files[0]}

    const formData = new FormData();
    formData.append('file', this.filePath || null);
    formData.append('File_data_id', this.fileId);
    formData.append('file_name', this.fileForm.get('file_name')?.value);
    formData.append('Doc_No', this.fileForm.get('Doc_No')?.value);
    formData.append('Year', this.fileForm.get('Year')?.value);
    formData.append('txt_Ar', this.fileForm.get('txt_Ar')?.value);
    formData.append('txt_Eng', this.fileForm.get('txt_Eng')?.value);
    formData.append('Country_id', this.fileForm.get('Country_id')?.value);
    formData.append('isAuthorized', this.fileForm.get('isAuthorized')?.value);
    formData.append('isActive', this.fileForm.get('isActive')?.value);
    formData.append('Category_id', this.fileForm.get('Category_id')?.value);
    formData.append('subCategories', this.fileForm.get('subCategories')?.value);
    formData.append('status_id', this.fileForm.get('status_id')?.value);
    formData.append('file_desc', this.fileForm.get('file_desc')?.value);
    // formData.append('createdByID', this.fileForm.get('createdByID')?.value);
    // formData.append('createdAt', this.fileForm.get('createdAt')?.value);
    // formData.append('updatedAt',this.fileForm.get('updatedAt')?.setValue(new Date().toISOString()));
    // formData.append('userID', this.userId);

    console.log(formData);
    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });
    this.fileService.updateFile(formData).subscribe(
      (result) => {
        this.toastr.success('File Updated Successfully', 'Success');
        this.router.navigate(['/file_details', this.fileId]);
      },
      (error) => {
        error?.error?.message
          ? this.toastr.error(error?.error?.message, 'Error')
          : this.toastr.error('Something went wrong', 'Error');
      }
    );
  }

  cancel() {
    this.router.navigate(['/file_details', this.fileId]);
  }
}
