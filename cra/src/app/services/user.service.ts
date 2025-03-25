import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppUser } from '../models/interfaces/user.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:8081/api/v1/users';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<{ content: AppUser[] }> {
    return this.http.get<{ content: AppUser[] }>(`${this.baseUrl}/all`);
  }  
  

  getUserById(id: string): Observable<AppUser> {
    return this.http.get<AppUser>(`${this.baseUrl}/${id}`);
  }

  createUser(user: AppUser): Observable<AppUser> {
    return this.http.post<AppUser>(this.baseUrl, user);
  }

  updateUser(id: string, user: AppUser): Observable<AppUser> {
    return this.http.put<AppUser>(`${this.baseUrl}/${id}`, user);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
