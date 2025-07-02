import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isLoading = false;
  errorMessage = '';

  countries = [
    'Türkiye', 'ABD', 'Almanya', 'Fransa', 'İngiltere', 'İtalya', 'İspanya', 
    'Hollanda', 'Belçika', 'Avusturya', 'İsviçre', 'Kanada', 'Avustralya'
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    
    // Redirect if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  private initForm(): void {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, this.passwordValidator]],
      confirmPassword: ['', [Validators.required]],
      city: ['', [Validators.required]],
      country: ['', [Validators.required]],
      photoUrl: ['']
    }, { validators: this.passwordMatchValidator });
  }

  // Custom password validator
  passwordValidator(control: AbstractControl): {[key: string]: any} | null {
    const password = control.value;
    
    if (!password) {
      return null;
    }

    const hasMinLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    if (!hasMinLength || !hasNumber || !hasSpecialChar) {
      return { 'passwordRequirements': true };
    }

    return null;
  }

  // Password match validator
  passwordMatchValidator(group: AbstractControl): {[key: string]: any} | null {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { 'passwordMismatch': true };
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const formValue = this.registerForm.value;
    const { confirmPassword, ...registerData } = formValue;

    // API için firstName ve lastName'i name olarak birleştir
    const apiRegisterData = {
      ...registerData,
      name: `${registerData.firstName} ${registerData.lastName}`,
      photo_url: registerData.photoUrl || ''
    };

    this.authService.register(apiRegisterData).subscribe({
      next: (user) => {
        this.isLoading = false;
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message;
      }
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return 'Bu alan zorunludur';
      }
      if (field.errors['email']) {
        return 'Geçerli bir email adresi girin';
      }
      if (field.errors['minlength']) {
        const requiredLength = field.errors['minlength'].requiredLength;
        return `En az ${requiredLength} karakter olmalıdır`;
      }
      if (field.errors['passwordRequirements']) {
        return 'Şifre en az 8 karakter, 1 rakam ve 1 özel karakter içermelidir';
      }
    }

    // Check for password mismatch
    if (fieldName === 'confirmPassword' && this.registerForm.errors?.['passwordMismatch'] && field?.touched) {
      return 'Şifreler eşleşmiyor';
    }
    
    return '';
  }
}
