import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-dashboard-overview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid" style="display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin-bottom:16px">
      <div class="card" style="background:#fff;border-radius:10px;padding:16px;box-shadow:0 6px 18px rgba(15,23,42,0.06)">
        <h3>Profile</h3>
        <p class="muted">Email: <strong>{{ email }}</strong></p>
        <p class="muted">Active Branch: <strong>{{ branchName }}</strong></p>
      </div>

      <div class="card" style="background:#fff;border-radius:10px;padding:16px;box-shadow:0 6px 18px rgba(15,23,42,0.06)">
        <h3>Quick Actions</h3>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          <button class="primary" (click)="goToItems()">Items</button>
          <button class="secondary">New Invoice</button>
          <button class="secondary">New Customer</button>
        </div>
      </div>
    </div>

    <div class="card" style="background:#fff;border-radius:10px;padding:16px;box-shadow:0 6px 18px rgba(15,23,42,0.06)">
      <h3>Recent Activity</h3>
      <p class="muted">No recent activity to show.</p>
    </div>
  `
})
export class DashboardOverviewComponent {
  email = '';
  branchName = '';

  constructor(private auth: AuthService, private router: Router) {
    this.email = this.extractEmailFromToken() || 'unknown@domain.local';
  }

  goToItems() {
    this.router.navigate(['/dashboard/items']);
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
