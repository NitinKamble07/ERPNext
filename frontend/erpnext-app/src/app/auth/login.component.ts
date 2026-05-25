import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  styles: [
    `:host { display: block; min-height: 100vh; background: #f3f4f6; }
     .auth-wrap { display: flex; align-items: center; justify-content: center; padding: 24px; }
     .card { width: 100%; max-width: 420px; background: #fff; border-radius: 10px; box-shadow: 0 6px 18px rgba(15,23,42,0.08); padding: 24px; }
     h2 { margin: 0 0 12px 0; font-size: 1.5rem; color: #111827; }
     form { display: flex; flex-direction: column; gap: 12px; }
     label { font-size: 0.9rem; color: #374151; }
     input[type='text'], input[type='password'], input[type='email'] { width: 100%; padding: 10px 12px; border-radius: 8px; border: 1px solid #e5e7eb; background: #fff; font-size: 0.95rem; box-sizing: border-box; }
     .btn { display: inline-block; width: 100%; padding: 10px 12px; border-radius: 8px; background: #2563eb; color: #fff; border: none; cursor: pointer; font-weight: 600; }
     .link { color: #2563eb; text-decoration: none; }
     .msg { font-size: 0.9rem; }
     .error { color: #dc2626; }
     .success { color: #16a34a; }
     @media (max-width: 480px) {
       .card { padding: 18px; border-radius: 8px; }
       h2 { font-size: 1.25rem; }
     }
    `
  ],
  template: `
    <div class="auth-wrap">
      <div class="card">
        <h2>Login</h2>

        <form (ngSubmit)="submit()">
          <div>
            <label for="email">Email</label>
            <input id="email" type="email" [(ngModel)]="email" name="email" required />
          </div>

          <div>
            <label for="password">Password</label>
            <input id="password" type="password" [(ngModel)]="password" name="password" required />
          </div>

          <button type="submit" class="btn">Login</button>
        </form>

        <p *ngIf="error" class="msg error">{{ error }}</p>
        <p class="msg" style="margin-top:12px">Don't have an account? <a routerLink="/register" class="link">Register</a></p>
      </div>
    </div>
  `
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    this.error = '';
    this.auth.login(this.email, this.password).subscribe({
      next: (res: any) => {
        const token = res?.token ?? res?.Token ?? null;
        if (token) {
          // persist via AuthService
          // AuthService will store token in sessionStorage
          this.router.navigate(['/dashboard']);
        } else {
          this.error = 'Login succeeded but no token returned.';
        }
      },
      error: (err: any) => {
        if (err?.error) {
          if (typeof err.error === 'string') this.error = err.error;
          else if (err.error?.message) this.error = err.error.message;
          else this.error = JSON.stringify(err.error);
        } else if (err?.status === 401) {
          this.error = 'Invalid email or password.';
        } else {
          this.error = 'Login failed. Please try again.';
        }
      }
    });
  }
}
