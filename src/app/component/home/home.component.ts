// import { SocialAuthService } from '@abacritt/angularx-social-login';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Category } from 'src/app/interfaces/category';
import { SearchFiltre } from 'src/app/interfaces/searchFile';
import { AuthService } from 'src/app/services/auth.service';
import { CategoryService } from 'src/app/services/category.service';
import { FileService } from 'src/app/services/file.service';
import { LoadingService } from 'src/app/services/loading.service';
import { DatePipe } from '@angular/common';
import { CookieOptions, CookieService } from 'ngx-cookie-service';
declare var bootstrap: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user: any;
  countries: any;
  categories: Category[] = [];
  files: any;
  page = 1;
  pageSize = 10;
  totalItems = 0;
  imageUrl: any;
  filesByCountryId: any;
  roles: any;
  loadedData: boolean = false
  allStatus: any;
  fileName: any;
  fileYear: any;
  fileDocNo: any;
  fileTxt: any;
  showActiveFilesTable = true;
  inactiveFiles: any[] = []
  disabledTooltip = 'Button is disabled';
  searchForm: any;
  allFiles: any;
  selectedCategory: any;
  subCategoriesArr: any;
  countryFlag: any;
  selectedCategoryIndex!: any;
  selectedSubcategoryIndex!: any;
  activeFileFilter = false;
  datePipe = new DatePipe('en-US');
  searchBox = false;
  isSmallScreen: boolean = false;
  lastClickTime: number = 0;




  constructor(private authService: AuthService,
    private cookieService: CookieService,
    private router: Router, private loadingService: LoadingService,
    // private googleService: SocialAuthService,
    private fileService: FileService,
    public categoryService: CategoryService, private http: HttpClient, private fb: FormBuilder) {
  }



  ngOnInit(): void {
    this.searchForm = this.fb.group({
      File_name: [''],
      Year: [''],
      Doc_no: [''],
      Txt: [''],
      Status_id: [''],
      category_id: [''],
      subcat_id: ['']
    })

    this.user = JSON.parse(this.cookieService.get('user')!)
    console.log(this.user)

    const userRoleId = this.user.role_id
    this.categoryService.getRoleById(userRoleId).subscribe((res: any) => {
      this.roles = res

    })

    this.loadingService.show()

    this.categoryService.getCountries().subscribe(res => {
      this.loadingService.hide();
      this.countries = res
    },
      (error) => {
        this.loadingService.setError(error.message);
        this.loadingService.hide();
      })

    this.fileService.getFileStatus().subscribe(res => {
      this.loadingService.hide();
      this.allStatus = res
    }, (error) => {
      this.loadingService.setError(error.message);
      this.loadingService.hide()
    })


    this.categoryService.getCategories().subscribe({
      next: (res: any) => {
        this.loadingService.hide();
        this.categories = res;
        let subCategories = [
          { subcat_id: 1, isActive: true },
          { subcat_id: 2, isActive: false }
        ];

      },
      error: (error: any) => {
        this.loadingService.setError(error.message);
        this.loadingService.hide();
      }
    })

    this.showAll();

    this.setIsSmallScreen();

  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.setIsSmallScreen();
  }

  private setIsSmallScreen() {
    this.isSmallScreen = window.innerWidth < 576; // Adjust the breakpoint as per your needs
  }

  getCountryFlag(countryId: number): string {
    const country = this.countries?.find((c: any) => c.id === countryId);
    return country ? country.flag : '';
  }

  logout() {
    this.authService.logout()
    // this.googleService.signOut()
    this.router.navigate(["/login"])
  }

  getDataForPage() {
    if (this.files) {
      const startIndex = (this.page - 1) * this.pageSize;
      return this.files.slice(startIndex, startIndex + this.pageSize);
    }
    return [];
  }


  get totalPages() {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  get pages() {
    const start = Math.max(1, this.page - 2);
    const end = Math.min(this.totalPages, this.page + 2);
    return Array(end - start + 1).fill(0).map((_, i) => start + i);
  }


  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.page = page;
    }
  }


  filterDataByCountry(countryId: any) {
    this.user.Country_id = countryId;
    this.cookieService.set('user', JSON.stringify(this.user), 1, '/', '', true, 'Strict');
    const searchObj: SearchFiltre = {
      country_id: countryId,
      status_id: null,
      file_name: null,
      year: null,
      txt: null,
      doc_no: null,
    };

    this.searchForFiles(searchObj)
  }


  filterDataByCat(category: Category, index: number, event: MouseEvent) {
    // منع السلوك الافتراضي للرابط
    event.preventDefault();

    const searchFilter: SearchFiltre = {
      category_id: category.cat_id,
      country_id: this.user.Country_id,
      status_id: null,
      file_name: null,
      year: null,
      txt: null,
      doc_no: null,
    };

    this.searchForFiles(searchFilter);
    this.selectedCategoryIndex = index;
    this.selectedSubcategoryIndex = null;
    this.removeActiveFileFilter();

    // التعامل مع النقر في وضع الموبايل
    if (this.isSmallScreen) {
      const subMenu = document.getElementById(`dash${index}`);
      if (subMenu) {
        const isExpanded = subMenu.classList.contains('show');

        // إغلاق القائمة إذا لم تكن هناك قائمة فرعية أو كانت مفتوحة
        if (!category.subcategories || category.subcategories.length === 0 || isExpanded) {
          const navbarCollapse = document.getElementById('navbarVerticalCollapse');
          if (navbarCollapse) {
            const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
            if (bsCollapse) {
              bsCollapse.hide();
            }
          }
        }
      }
    }
  }


  filterDataBySub(category: any, subCategories: any) {
    const searchObj: SearchFiltre = {
      subcat_id: subCategories.subcat_id,
      category_id: category.cat_id,
      country_id: this.user.Country_id,
      status_id: null,
      file_name: null,
      year: null,
      doc_no: null,
      txt: null
    };

    this.searchForFiles(searchObj);
    this.selectedCategoryIndex = category.id;
    this.selectedSubcategoryIndex = subCategories.subcat_id;
    this.removeActiveFileFilter();

    if (this.isSmallScreen) {
      const navbarCollapse = document.getElementById('navbarVerticalCollapse');
      const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
      if (bsCollapse) {
        bsCollapse.hide();
      }
    }
  }




  filterBySearchForm() {
    const searchObj: SearchFiltre = {
      file_name: this.searchForm.get('File_name')?.value,
      year: this.searchForm.get('Year')?.value,
      doc_no: this.searchForm.get('Doc_no')?.value,
      txt: this.searchForm.get('Txt')?.value,
      country_id: this.user.Country_id,
      status_id: this.searchForm.get('Status_id')?.value,
      category_id: this.searchForm.get('category_id')?.value,
      subcat_id: this.searchForm.get('subcat_id')?.value?.length > 0
        ? this.searchForm.get('subcat_id')?.value
        : null
    };

    this.searchForFiles(searchObj);
    this.activeFileFilter = true;
  }

  clearAll() {
    this.searchForm.get('File_name').setValue('');
    this.searchForm.get('Year').setValue('');
    this.searchForm.get('Doc_no').setValue('');
    this.searchForm.get('Txt').setValue('');
    this.searchForm.get('Status_id').setValue('');
    this.searchForm.get('category_id').setValue('');
    this.searchForm.get('subcat_id').setValue('');

    this.showAll();
  }


  filterByActiveFile() {
    const searchObj: SearchFiltre = {
      isactive: true,
      country_id: this.user.Country_id,
      status_id: null,
      file_name: null,
      year: null,
      doc_no: null,
      txt: null
    };

    this.searchForFiles(searchObj);
    this.activeFileFilter = true;

    // إضافة collapse للقائمة في وضع الموبايل
    if (this.isSmallScreen) {
      const navbarCollapse = document.getElementById('navbarVerticalCollapse');
      if (navbarCollapse) {
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
        if (bsCollapse) {
          bsCollapse.hide();
        }
      }
    }
  }

  removeActiveFileFilter() {
    this.activeFileFilter = false;
  }

  showAll() {
    const searchObj: SearchFiltre = {
      isactive: true,
      country_id: this.user.Country_id,
      status_id: null,
      file_name: null,
      year: null,
      doc_no: null,
      txt: null
    };
    this.searchForFiles(searchObj),
      this.activeFileFilter = true;

  }

  searchForFiles(searchFilter: SearchFiltre) {
    this.loadingService.show();
    this.fileService.searchForFile(searchFilter).subscribe(result => {
      this.loadingService.hide();
      this.files = result;
      this.loadedData = true
      this.totalItems = this.files.length;
      this.getDataForPage()
      this.goToPage(1);

    },
      (error) => {
        this.loadingService.setError(error.message);
        this.loadingService.hide();
      }
    )
  }




  onChange() {
    // Clear subcategory selection first
    this.searchForm.get('subcat_id').setValue([]);

    // Then update subcategories array based on selected category
    for (const c of this.categories) {
      if (c.cat_id === this.selectedCategory) {
        this.subCategoriesArr = c.subcategories;
      }
    }
  }

  showInactiveFiles() {
    this.showActiveFilesTable = !this.showActiveFilesTable;
    // console.log(this.showActiveFilesTable)
    const userId = this.user.user_id
    if (!this.showActiveFilesTable) {
      this.fileService.getInactiveFiles(userId).subscribe(res => {
        this.loadingService.hide();
        // console.log(res)
        this.inactiveFiles = res
        this.loadedData = true

        this.totalItems = this.inactiveFiles.length;
        this.getDataForPage()
        this.goToPage(1);

      }, (error) => {
        this.loadingService.setError(error.message);
        this.loadingService.hide()
          ;
      })
    }
  }
  getInactiveFilesForPage() {
    if (this.inactiveFiles) {
      const startIndex = (this.page - 1) * this.pageSize;
      return this.inactiveFiles.slice(startIndex, startIndex + this.pageSize);
    }
    return [];
  }

  toggleCard() {
    this.searchBox = !this.searchBox
  }

  handleDoubleClick(event: MouseEvent) {
    if (this.isSmallScreen) {
      event.preventDefault();
      const navbarCollapse = document.getElementById('navbarVerticalCollapse');
      if (navbarCollapse) {
        const bsCollapse = new bootstrap.Collapse(navbarCollapse);
        bsCollapse.hide();
      }
    }
  }
}
