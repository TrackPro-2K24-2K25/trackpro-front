import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Timesheet } from '../models/interfaces/timesheet.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimesheetService {
  private apiUrl = 'http://localhost:8081/timesheets';

  constructor(private http: HttpClient) {}

  getAll(page: number = 0, size: number = 10): Observable<{ content: Timesheet[] }> {
    return this.http.get<{ content: Timesheet[] }>(`${this.apiUrl}?page=${page}&size=${size}`);
  }

  getById(id: string): Observable<Timesheet> {
    return this.http.get<Timesheet>(`${this.apiUrl}/${id}`);
  }

  create(timesheet: Partial<Timesheet>): Observable<Timesheet> {
    return this.http.post<Timesheet>(this.apiUrl, timesheet);
  }

  update(id: string, timesheet: Partial<Timesheet>): Observable<Timesheet> {
    return this.http.put<Timesheet>(`${this.apiUrl}/${id}`, timesheet);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
