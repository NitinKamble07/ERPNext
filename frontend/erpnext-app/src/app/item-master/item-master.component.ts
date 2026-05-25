import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';

interface ItemMaster {
  id?: string;
  itemId: string;
  branchId?: string | null;
  itemName: string;
  brandName?: string | null;
  createdBy?: string | null;
  createdDate?: string | null;
  updatedBy?: string | null;
  updatedDate?: string | null;
  deletedBy?: string | null;
  deletedDate?: string | null;
  isActive?: boolean;
}

@Component({
  selector: 'app-item-master',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styles: [
    `:host{display:block;padding:16px}.container{max-width:1100px;margin:0 auto}.card{background:#fff;padding:16px;border-radius:8px;box-shadow:0 6px 18px rgba(15,23,42,0.06)}.form-row{display:flex;gap:10px;flex-wrap:wrap}.form-row > div{flex:1;min-width:220px}.actions{display:flex;gap:8px;margin-top:10px}.table{width:100%;border-collapse:collapse;margin-top:16px}.table th,.table td{border:1px solid #e5e7eb;padding:8px;text-align:left}
    `
  ],
  template: `
    <div class="container">
      <h2>Item Master</h2>

      <div class="card">
        <div class="form-row">
          <div>
            <label>Item Id</label>
            <input [(ngModel)]="model.itemId" />
          </div>

          <div>
            <label>Branch</label>
            <select [(ngModel)]="model.branchId">
              <option [ngValue]="null">All</option>
              <option *ngFor="let b of branches" [value]="b.id">{{b.name}}</option>
            </select>
          </div>

          <div>
            <label>Item Name</label>
            <input [(ngModel)]="model.itemName" />
          </div>

          <div>
            <label>Brand</label>
            <select [(ngModel)]="model.brandName">
              <option [ngValue]="null">--</option>
              <option *ngFor="let br of brands" [value]="br">{{br}}</option>
            </select>
          </div>
        </div>

        <div class="actions">
          <button (click)="save()" class="primary">Save</button>
          <button (click)="reset()" class="secondary">Reset</button>
        </div>

        <table class="table">
          <thead>
            <tr><th>ItemId</th><th>Branch</th><th>Name</th><th>Brand</th><th>Active</th><th>Actions</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let it of items">
              <td>{{it.itemId}}</td>
              <td>{{ getBranchName(it.branchId) }}</td>
              <td>{{it.itemName}}</td>
              <td>{{it.brandName}}</td>
              <td>{{it.isActive}}</td>
              <td>
                <button (click)="edit(it)">Edit</button>
                <button (click)="delete(it)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class ItemMasterComponent implements OnInit {
  model: ItemMaster = { itemId: '', itemName: '', isActive: true } as any;
  items: ItemMaster[] = [];
  branches = [ { id: 'b1', name: 'Head Office'}, { id: 'b2', name: 'Warehouse A'}, { id: 'b3', name: 'Retail Outlet'}];
  brands = ['Brand A', 'Brand B', 'Brand C'];

  // map of branchId => branch name for template lookup (avoid arrow functions in template)
  branchesMap: Record<string, string> = {};

  baseUrl = (window as any).API_BASE || 'https://localhost:63562';

  constructor(private http: HttpClient, private auth: AuthService) {}

  ngOnInit(): void {
    // initialize map
    this.branchesMap = Object.fromEntries(this.branches.map(b => [b.id, b.name]));
    this.load();
  }

  getBranchName(branchId?: string | null): string {
    if (!branchId) return '';
    return this.branchesMap[branchId] ?? '';
  }

  load() {
    const params: any = {};
    if (this.model.branchId) params.branchId = this.model.branchId;
    this.http.get<ItemMaster[]>(`${this.baseUrl}/api/ItemMaster`, { params }).subscribe((r: any) => this.items = r as ItemMaster[]);
  }

  save() {
    const userId = this.auth.getUserId();
    if (this.model.id) {
      // update
      this.model.updatedBy = userId;
      this.model.updatedDate = new Date().toISOString();
      this.http.put(`${this.baseUrl}/api/ItemMaster/${this.model.id}`, this.model).subscribe(() => this.load());
    } else {
      // create
      this.model.createdBy = userId;
      this.model.createdDate = new Date().toISOString();
      this.http.post(`${this.baseUrl}/api/ItemMaster`, this.model).subscribe(() => this.load());
    }
    this.reset();
  }

  edit(it: ItemMaster) {
    this.model = { ...it };
  }

  delete(it: ItemMaster) {
    if (!it.id) return;
    // for delete, send user id in body? API marks deleted fields, we call DELETE which is authorized and server will set DeletedBy/Date.
    this.http.delete(`${this.baseUrl}/api/ItemMaster/${it.id}`).subscribe(() => this.load());
  }

  reset() { this.model = { itemId: '', itemName: '', isActive: true } as any; }
}
