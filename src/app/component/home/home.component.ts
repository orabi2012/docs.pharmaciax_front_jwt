// import { SocialAuthService } from '@abacritt/angularx-social-login';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Category } from 'src/app/interfaces/category';
import { SearchFiltre } from 'src/app/interfaces/searchFile';
import { AuthService } from 'src/app/services/auth.service';
import { CategoryService } from 'src/app/services/category.service';
import { FileService } from 'src/app/services/file.service';
import { LoadingService } from 'src/app/services/loading.service';
import { DatePipe } from '@angular/common';
import { CookieOptions, CookieService } from 'ngx-cookie-service';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { trigger, state, style, animate, transition } from '@angular/animations';
declare var bootstrap: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('slideAnimation', [
      state('down', style({
        height: '*',
        opacity: 1,
        overflow: 'hidden'
      })),
      state('up', style({
        height: '0',
        opacity: 0,
        overflow: 'hidden',
        padding: '0'
      })),
      transition('down => up', [
        animate('300ms ease-out')
      ]),
      transition('up => down', [
        animate('300ms ease-in')
      ])
    ])
  ]
})
export class HomeComponent implements OnInit {
  user: any;
  countries: any;
  categories: Category[] = [];
  files: any;
  filteredFiles: any[] = []; // Add the filteredFiles property
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
  isCardCollapsed = false; // Track the collapse state of the search card
  isSmallScreen: boolean = false;
  lastClickTime: number = 0;
  @ViewChild(CdkVirtualScrollViewport) viewport!: CdkVirtualScrollViewport;




  constructor(private authService: AuthService,
    private cookieService: CookieService,
    private router: Router, private loadingService: LoadingService,
    // private googleService: SocialAuthService,
    private fileService: FileService,
    public categoryService: CategoryService, private http: HttpClient, private fb: FormBuilder) {
  }



  ngOnInit(): void {
    // Set initial state of search box (expanded by default)
    this.searchBox = true;
    this.isCardCollapsed = false;
    // Initialize filteredFiles with empty array
    this.filteredFiles = [];

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
    // console.log(this.user)

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

    // تفعيل tooltips
    setTimeout(() => {
      const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
      tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
      });
    });
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

    if (this.isSmallScreen) {
      const subMenu = document.getElementById(`dash${index}`);
      if (subMenu) {
        const isExpanded = subMenu.classList.contains('show');

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


  filterDataBySub(category: any, subcategory: any) {
    const searchObj: SearchFiltre = {
      subcat_id: subcategory.subcat_id,
      category_id: category.cat_id,
      country_id: this.user.Country_id,
      status_id: null,
      file_name: null,
      year: null,
      doc_no: null,
      txt: null
    };
    this.searchForFiles(searchObj);
    this.selectedCategoryIndex = null;
    this.selectedSubcategoryIndex = subcategory.subcat_id;
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
    this.filteredFiles = []; // Initialize filteredFiles with empty array
    this.fileService.searchForFile(searchFilter).subscribe(
      res => {
        this.files = res;
        this.filteredFiles = res; // Populate filteredFiles with search results
        this.loadingService.hide();
        this.loadedData = true;
        this.totalItems = this.files.length;

        if (this.viewport) {
          this.viewport.checkViewportSize();
        }
      },
      error => {
        this.loadingService.setError(error.message);
        this.loadingService.hide();
      }
    );
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
    const userId = this.user.user_id;
    if (!this.showActiveFilesTable) {
      this.fileService.getInactiveFiles(userId).subscribe(
        res => {
          this.loadingService.hide();
          this.inactiveFiles = res;
          this.loadedData = true;
          this.totalItems = this.inactiveFiles.length;

          if (this.viewport) {
            this.viewport.checkViewportSize();
          }
        },
        error => {
          this.loadingService.setError(error.message);
          this.loadingService.hide();
        }
      );
    }
  }

  toggleCard() {
    this.isCardCollapsed = !this.isCardCollapsed;
    // If we're opening the card, make sure searchBox is true
    if (!this.isCardCollapsed) {
      this.searchBox = true;
    } else {
      // If we're closing, wait for animation to complete before hiding
      setTimeout(() => {
        if (this.isCardCollapsed) {
          this.searchBox = false;
        }
      }, 300); // Match animation duration
    }
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

  hasCommercialFraud(item: any): boolean {
    // التحقق من وجود "غش تجاري" في الـsubCategories
    return item.subCategories?.some((sub: any) =>
      sub.SubCategory_name?.includes('غش تجاري')
    );
  }

  getTotalViews(): number {
    if (!this.files) return 0;

    return this.files.reduce((total: number, item: any) => {
      return total + (item.views || 0);
    }, 0);
  }

  // دالة trackBy لتحسين الأداء
  trackByFn(index: number, item: any): number {
    return item.File_data_id;
  }
}
