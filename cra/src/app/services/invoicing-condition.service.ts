import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InvoicingConditions } from '../models/interfaces/invoicing-conditions.interface';
import { PaginatedResponse } from '../models/interfaces/paginated-response.interface';

@Injectable({ providedIn: 'root' })
export class InvoicingConditionService {
  private baseUrl = 'http://localhost:8081/api/v1/invoicing-conditions';

  constructor(private http: HttpClient) {}

  getAll(page = 0, size = 10): Observable<PaginatedResponse<InvoicingConditions>> {
    return this.http.get<PaginatedResponse<InvoicingConditions>>(
      `${this.baseUrl}?page=${page}&size=${size}`
    );
  }

  create(condition: InvoicingConditions): Observable<InvoicingConditions> {
    return this.http.post<InvoicingConditions>(this.baseUrl, condition);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
