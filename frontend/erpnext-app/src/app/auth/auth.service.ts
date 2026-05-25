import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  baseUrl = (window as any).API_BASE || 'https://localhost:63562';

  private tokenKey = 'auth_token';
  private userKey = 'auth_user';
  private _token: string | null = null;

  constructor(private http: HttpClient) {
    // hydrate from sessionStorage if present
    const t = sessionStorage.getItem(this.tokenKey);
    if (t) this._token = t;
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/Auth/login`, { email, password }).pipe(
      tap((res: any) => {
        const token = res?.token ?? res?.Token ?? null;
        if (token) {
          this.setToken(token);
          // fetch profile and persist
          this.fetchProfile().subscribe();
        }
      })
    );
  }

  register(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/Auth/register`, { email, password }).pipe(
      tap((res: any) => {
        const token = res?.token ?? res?.Token ?? null;
        if (token) {
          this.setToken(token);
          this.fetchProfile().subscribe();
        }
      })
    );
  }

  private fetchProfile(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/Auth/me`).pipe(
      tap((u: any) => {
        try {
          sessionStorage.setItem(this.userKey, JSON.stringify(u));
        } catch { }
      })
    );
  }

  setToken(token: string) {
    this._token = token;
    // persist in sessionStorage instead of localStorage for slightly better security
    sessionStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    if (this._token) return this._token;
    const t = sessionStorage.getItem(this.tokenKey);
    if (t) this._token = t;
    return this._token;
  }

  clearToken() {
    this._token = null;
    sessionStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.userKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    this.clearToken();
  }

  // Returns the stored user object (or null)
  getUser(): any | null {
    const s = sessionStorage.getItem(this.userKey);
    if (!s) return null;
    try { return JSON.parse(s); } catch { return null; }
  }

  // Return user id (string) or null
  getUserId(): string | null {
    const u = this.getUser();
    return u?.id ?? u?.Id ?? null;
  }
}
