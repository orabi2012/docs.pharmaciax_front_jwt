import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { LoadingService } from '../../services/loading.service';
import { MessageService } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
    resetForm: FormGroup;
    token!: string;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private authService: AuthService,
        private router: Router,
        private loadingService: LoadingService,
        private messageService: MessageService,
        private primengConfig: PrimeNGConfig
    ) {
        this.resetForm = this.fb.group({
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', [Validators.required]]
        }, { validator: this.passwordMatchValidator });
    }

    ngOnInit() {
        this.token = this.route.snapshot.params['token'];
        this.primengConfig.ripple = true;
    }

    get passwordControl() { return this.resetForm.get('password'); }
    get confirmPasswordControl() { return this.resetForm.get('confirmPassword'); }

    passwordMatchValidator(g: FormGroup) {
        return g.get('password')?.value === g.get('confirmPassword')?.value
            ? null : { 'mismatch': true };
    }

    onSubmit() {
        if (this.resetForm.valid) {
            const password = this.passwordControl?.value;
            const confirmPassword = this.confirmPasswordControl?.value;

            this.loadingService.show();

            this.authService.resetPassword(this.token, password, confirmPassword)
                .subscribe({
                    next: () => {
                        this.loadingService.hide();
                        this.messageService.add({
                            key: 'tc',
                            severity: 'success',
                            summary: 'تم بنجاح',
                            detail: 'تم تغيير كلمة المرور بنجاح'
                        });
                        // Increased timeout to 5 seconds
                        setTimeout(() => {
                            this.router.navigate(['/login']);
                        }, 5000);
                    },
                    error: (error) => {
                        this.loadingService.setError(error.message);
                        this.loadingService.hide();
                        this.messageService.add({
                            key: 'tc',
                            severity: 'error',
                            summary: 'خطأ',
                            detail: error?.error?.message || error?.message || 'فشل في تغيير كلمة المرور'
                        });
                    }
                });
        }
    }
}
