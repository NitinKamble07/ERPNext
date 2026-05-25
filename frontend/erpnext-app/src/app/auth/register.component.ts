import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],   // added CommonModule
  styles: [
    `:host { display: block; min-height: 100vh; background: #f3f4f6; }
     .auth-wrap { display: flex; align-items: center; justify-content: center; padding: 24px; }
     .card { width: 100%; max-width: 420px; background: #fff; border-radius: 10px; box-shadow: 0 6px 18px rgba(15,23,42,0.08); padding: 24px; }
     h2 { margin: 0 0 12px 0; font-size: 1.5rem; color: #111827; }
     form { display: flex; flex-direction: column; gap: 12px; }
     label { font-size: 0.9rem; color: #374151; }
     input[type='text'], input[type='password'], input[type='email'] { width: 100%; padding: 10px 12px; border-radius: 8px; border: 1px solid #e5e7eb; background: #fff; font-size: 0.95rem; box-sizing: border-box; }
     .btn { display: inline-block; width: 100%; padding: 10px 12px; border-radius: 8px; background: #16a34a; color: #fff; border: none; cursor: pointer; font-weight: 600; }
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
      <h2>Register</h2>

      <form (ngSubmit)="submit()">
        <div>
          <label for="email">Email</label>
          <input id="email" type="email" [(ngModel)]="email" name="email" required />
        </div>

        <div>
          <label for="password">Password</label>
          <input id="password" type="password" [(ngModel)]="password" name="password" required />
        </div>

        <button class="btn">Register</button>
      </form>

      <p *ngIf="message" class="msg success">{{ message }}</p>
      <p *ngIf="error" class="msg error">{{ error }}</p>

      <p class="msg" style="margin-top:12px">Already have an account? <a routerLink="/login" class="link">Login</a></p>
    </div>
  </div>
  `
})
export class RegisterComponent {
  email = '';
  password = '';
  message = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    this.message = this.error = '';
    this.auth.register(this.email, this.password).subscribe({
      next: (res: any) => {
        this.message = 'Registration successful. You can now login.';
        // navigate to login after brief delay
        setTimeout(() => this.router.navigate(['/login']), 800);
      },
      error: (err: any) => {
        // Log the full error to help diagnose isTrusted / ProgressEvent cases
        console.error('Register error:', err);

        // Network error or CORS failure often surfaces as a ProgressEvent with isTrusted = true
        const maybeProgressEvent = err as ProgressEvent | { error?: any };
        if (maybeProgressEvent && (maybeProgressEvent as any).isTrusted) {
          this.error = 'Network error or CORS failure. Check backend is running and CORS configuration. See browser console/Network tab for details.';
          return;
        }

        // If HttpClient returned an error body, try to surface it
        if (err?.error) {
          if (typeof err.error === 'string') this.error = err.error;
          else if (err.error?.message) this.error = err.error.message;
          else this.error = JSON.stringify(err.error);
          return;
        }

        // Fallback message
        this.error = 'Registration failed. Please check your network and try again.';
      }
    });
  }
}
