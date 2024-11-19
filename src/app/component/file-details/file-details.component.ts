import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
// import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { FileService } from 'src/app/services/file.service';
import { PDFDocumentProxy } from 'ngx-extended-pdf-viewer';
// import { PDFDocumentProxy } from 'ng2-pdf-viewer';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { DomSanitizer, Meta, Title } from '@angular/platform-browser'; // <-- Added Meta and Title imports

@Component({
  selector: 'app-file-details',
  templateUrl: './file-details.component.html',
  styleUrls: ['./file-details.component.css']
})
export class FileDetailsComponent implements OnInit, OnDestroy {
  @Input() mobileZoom: boolean = true;
  public isMobile: boolean = false;
  file: any;
  user: any;
  pdfSrc!: string;
  page: number = 1;
  subObj: any = "";
  pdfLoading: boolean = true;
  isModalOpen = false;
  totalPages = 0;
  datePipe = new DatePipe('en-US');

  constructor(private route: ActivatedRoute,
    private cookieService: CookieService,
    private fileService: FileService,
    private router: Router,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private metaService: Meta,
    private titleService: Title
  ) {
    this.checkScreenSize();
  }

  pdfUrl: any;
  ngOnInit(): void {
    this.user = JSON.parse(this.cookieService.get('user')!)
    const FileId = this.route.snapshot.paramMap.get('id')
    if (this.checkUserLoggedIn()) {
      this.loadFileDetails(FileId);
    } else {
      // User is not logged in, redirect to the login page
      this.router.navigate(['/login']);
    }

    // Add resize listener
    window.addEventListener('resize', this.checkScreenSize.bind(this));
  }

  ngOnDestroy() {
    // Remove resize listener
    window.removeEventListener('resize', this.checkScreenSize.bind(this));
  }

  private checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  private checkUserLoggedIn(): boolean {
    // Implement your logic to check if the user is logged in
    // You can access the token from the cookie service and validate it
    const token = this.cookieService.get('tokenJwt');
    // Add your token validation logic here
    return !!token; // Return true if the token is valid, false otherwise
  }
  private loadFileDetails(fileId: string | null): void {
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.fileService.getFile(fileId!, headers).subscribe(
      (res: any) => {
        // console.log('Response:', res);
        // File details retrieval success
        this.file = res;
        this.pdfLoading = true;
        this.updateMetaTags();

        const subArr = this.file.data.subCategories;
        this.subObj = subArr.map((subcat: any) => subcat?.SubCategory_name).join(" ]  [ ");
        this.subObj = " [ " + this.subObj + " ] ";

        const filePath = this.file?.data?.fileID;
        const url = `${environment.base_url}apigoogle/${filePath}`;

        this.fileService.getFileFromGoogle(url).subscribe((blob: any) => {
          const pdfBlob = new Blob([blob], { type: 'application/pdf' });
          this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(pdfBlob));
          this.pdfLoading = false;
        });
      },
      (error: HttpErrorResponse) => {
        // File details retrieval error
        if (error.status === 401) {
          // Unauthorized access
          console.log('Unauthorized access');
          this.router.navigate(['/login']);
        } else {
          // Other error handling logic
          // You can display an error message or handle the error in a different way
          console.error('Error retrieving file details:', error);
          // For example, you can show a toast or a modal with an error message
          // this.toastr.error('Failed to load file details. Please try again later.', 'Error');
        }
        this.pdfLoading = false; // Ensure loading spinner is hidden even in case of an error
      }
    );
  }

  // <-- New method to dynamically update the OG meta tags
  private updateMetaTags(): void {
    const title = this.file?.data?.file_name || 'Docs.pharmaciax.com';
    const description = this.file?.data?.txt_Eng || "";
    const imageUrl = "https://docs.pharmaciax.com/assets/img/logos/logo3.png";
    const url = `https://docs.pharmaciax.com/file_details/${this.file?.data?.File_data_id}`;

    this.titleService.setTitle(title); // <-- Set the page title

    this.metaService.updateTag({ name: 'description', content: description }); // <-- Update description
    this.metaService.updateTag({ property: 'og:title', content: title }); // <-- Update OG title
    this.metaService.updateTag({ property: 'og:description', content: description }); // <-- Update OG description
    this.metaService.updateTag({ property: 'og:image', content: imageUrl }); // <-- Update OG image
    this.metaService.updateTag({ property: 'og:url', content: url }); // <-- Update OG URL
    this.metaService.updateTag({ property: 'og:type', content: 'website' }); // <-- Set OG type
  }

  onPdfLoadComplete(event: any): void {
    const pdf: PDFDocumentProxy = event.source._pdfInfo;
    this.pdfLoading = false;
    this.totalPages = pdf.numPages;
  }
  delete(id: any) {
    this.fileService.deleteFile(id).subscribe((res: any) => {
      this.router.navigate(['/home'])
    });
  }
}
