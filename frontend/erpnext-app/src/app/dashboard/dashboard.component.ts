import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterOutlet],
  styles: [
    `:host { display: block; min-height: 100vh; background: #f3f4f6; font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; color:#111827 }
     .container { auto; padding: 0 16px; }
     .header { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:18px; }
     .brand { display:flex; align-items:center; gap:12px; }
     .logo { width:42px; height:42px; background:linear-gradient(135deg,#2563eb,#7c3aed); border-radius:8px; display:flex; align-items:center; justify-content:center; color:#fff; font-weight:700 }
     .app-title { font-size:1.125rem; font-weight:600 }

     .top-controls { display:flex; align-items:center; gap:12px; }
     select.branch { padding:8px 10px; border-radius:8px; border:1px solid #e5e7eb; background:#fff }
     .user-info { display:flex; align-items:center; gap:8px }
     .avatar { width:36px; height:36px; border-radius:999px; background:#c7d2fe; display:inline-flex; align-items:center; justify-content:center; color:#3730a3; font-weight:700 }
     .btn-logout { padding:8px 12px; border-radius:8px; border:1px solid #e5e7eb; background:#fff; cursor:pointer }

     .layout { display:grid; grid-template-columns: 260px 1fr; gap:18px; }
     @media (max-width: 880px) { .layout { grid-template-columns: 1fr; } }

     .sidebar { background:#fff; border-radius:10px; padding:16px; box-shadow: 0 6px 18px rgba(15,23,42,0.06); }
     .nav-item { padding:10px; border-radius:8px; color:#374151; display:block; text-decoration:none; margin-bottom:6px }
     .nav-item:hover { background:#f8fafc; color:#111827 }

     .content {  }
     footer { text-align:center; color:#6b7280; font-size:0.9rem; margin-top:22px }
    `
  ],
  template: `
  <div class="container">
    <header class="header">
      <div class="brand">
        <div class="logo">EN</div>
        <div>
          <div class="app-title">ERPNext</div>
          <div class="muted">Enterprise management made simple</div>
        </div>
      </div>

      <div class="top-controls">
        <label class="muted" for="branchSelect">Branch</label>
        <select id="branchSelect" class="branch" [(ngModel)]="selectedBranch">
          <option *ngFor="let b of branches" [value]="b.id">{{ b.name }}</option>
        </select>

        <div class="user-info">
          <div class="avatar">{{ initials }}</div>
          <div class="muted">{{ email }}</div>
          <button class="btn-logout" (click)="logout()">Logout</button>
        </div>
      </div>
    </header>

    <div class="layout">
      <aside class="sidebar">
        <nav>
          <a routerLink="/dashboard" class="nav-item">Overview</a>
          <a routerLink="/dashboard/items" class="nav-item">Items</a>
          <a class="nav-item">Sales</a>
          <a class="nav-item">Purchases</a>
          <a class="nav-item">Inventory</a>
          <a class="nav-item">Manufacturing</a>
        </nav>
      </aside>

      <main class="content">
        <router-outlet></router-outlet>
      </main>
    </div>

    <footer>© 2026 ERPNext — All rights reserved</footer>
  </div>
  `
})
export class DashboardComponent {
  email = '';
  branches = [
    { id: 'b1', name: 'Head Office' },
    { id: 'b2', name: 'Warehouse A' },
    { id: 'b3', name: 'Retail Outlet' }
  ];
  selectedBranch = this.branches[0].id;

  constructor(private auth: AuthService, private router: Router) {
    this.email = this.extractEmailFromToken() || 'unknown@domain.local';
  }

  get initials() {
    if (!this.email) return 'U';
    const parts = this.email.split('@')[0].split('.');
    return parts.map(p => p[0]?.toUpperCase()).slice(0,2).join('') || 'U';
  }

  get branchName() {
    return this.branches.find(b => b.id === this.selectedBranch)?.name ?? '';
  }

  goToItems(): void {
    this.router.navigate(['/dashboard/items']);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  private extractEmailFromToken(): string | null {
    const t = this.auth.getToken();
    if (!t) return null;
    try {
      const parts = t.split('.');
      if (parts.length < 2) return null;
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      return payload?.email ?? payload?.sub ?? null;
    } catch {
      return null;
    }
  }
}
