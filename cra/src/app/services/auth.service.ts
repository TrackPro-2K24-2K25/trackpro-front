import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private keycloakTokenUrl = 'http://localhost:8080/realms/TrackPro/protocol/openid-connect/token';
  private clientId = 'trackpro-frontend';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    const body = new HttpParams()
      .set('grant_type', 'password')
      .set('client_id', this.clientId)
      .set('username', username)
      .set('password', password);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    return new Observable((observer) => {
      this.http.post<any>(this.keycloakTokenUrl, body.toString(), { headers }).subscribe({
        next: (response) => {
          localStorage.setItem('access_token', response.access_token);
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        },
      });
    });
  }

  logout(): void {
    localStorage.removeItem('access_token');
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getDecodedToken(): any {
    const token = this.getToken();
    if (!token) return null;

    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  }

  getFirstName(): string | null {
    const decoded = this.getDecodedToken();
    return decoded?.given_name || null;
  }

  getLastName(): string | null {
    const decoded = this.getDecodedToken();
    return decoded?.family_name || null;
  }

  getUsername(): string | null {
    const decoded = this.getDecodedToken();
    return decoded?.preferred_username || null;
  }

  getEmail(): string | null {
    const decoded = this.getDecodedToken();
    return decoded?.email || null;
  }
}
