import { Component } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { RecaptchaModule } from 'ng-recaptcha';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RecaptchaModule],
  templateUrl: './auth-login.component.html',
  styleUrls: ['./auth-login.component.scss']
})
export class AuthLoginComponent {
  email: string = '';
  password: string = '';
  captchaToken: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  onCaptchaResolved(token: string): void {
    console.log('Captcha resolved:', token);
    this.captchaToken = token;
  }

  login(): void {
    // ✅ reCAPTCHA check before anything
    if (!this.captchaToken) {
      Swal.fire({
        icon: 'warning',
        title: 'reCAPTCHA required',
        text: 'Please confirm you are not a robot 🧠🤖',
      });
      return;
    }

    Swal.fire({
      title: 'Logging in...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Login successful ✅', response);
        localStorage.setItem('access_token', response.access_token);

        setTimeout(() => {
          Swal.close();
          this.router.navigate(['/dashboard/default']);
        }, 2000);
      },
      error: (err) => {
        console.error('Login failed ❌', err);

        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Login failed! Please check your credentials.',
        });
      }
    });
  }
}
