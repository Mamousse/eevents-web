import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  submitted = false;
  errorMessage = '';
  successMessage = '';
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      prenom: ['', Validators.required],
      nom: ['', Validators.required],
      telephone: ['', [Validators.required, Validators.pattern(/^[0-9]{9,15}$/)]],
      email: ['', [Validators.email]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  get f() {
    return this.registerForm.controls;
  }

  togglePasswordVisibility(field: string): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;

    const registerData = {
      prenom: this.registerForm.value.prenom,
      nom: this.registerForm.value.nom,
      telephone: this.registerForm.value.telephone,
      email: this.registerForm.value.email || undefined,
      username: this.registerForm.value.username,
      password: this.registerForm.value.password
    };

    this.authService.register(registerData).subscribe({
      next: () => {
        this.successMessage = 'Inscription réussie ! Redirection vers la page de connexion...';
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/admin/login']);
        }, 2000);
      },
      error: (error) => {
        this.errorMessage = error.error?.error?.message || 'Une erreur est survenue lors de l\'inscription';
        this.loading = false;
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/admin/login']);
  }
}
