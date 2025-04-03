import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ExpenseReport } from '../models/interfaces/expense-report.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExpenseReportService {
  private baseUrl = `http://localhost:8081/api/v1/expense-reports`;

  constructor(private http: HttpClient) {}

  // 🔹 GET /expense-reports?page=0&size=10
  getAllReports(page: number = 0, size: number = 10): Observable<any> {
    return this.http.get(`${this.baseUrl}?page=${page}&size=${size}`);
  }

  // 🔹 GET /expense-reports/{id}
  getReportById(id: string): Observable<ExpenseReport> {
    return this.http.get<ExpenseReport>(`${this.baseUrl}/${id}`);
  }

  // 🔹 POST /expense-reports
  createReport(report: ExpenseReport, files: File[]): Observable<ExpenseReport> {
    const formData = new FormData();
    formData.append('expenseReport', JSON.stringify(report));
    files.forEach(file => formData.append('files', file));
  
    return this.http.post<ExpenseReport>(this.baseUrl, formData);
  }
  

  // 🔹 PUT /expense-reports/{id}
  updateReport(id: string, report: ExpenseReport): Observable<ExpenseReport> {
    return this.http.put<ExpenseReport>(`${this.baseUrl}/${id}`, report);
  }

  // 🔹 DELETE /expense-reports/{id}
  deleteReport(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
