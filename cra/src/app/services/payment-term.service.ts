// src/app/services/payment-term.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaymentTerm } from '../models/interfaces/payment-term.interface';

@Injectable({ providedIn: 'root' })
export class PaymentTermService {
  private baseUrl = 'http://localhost:8081/api/v1/payment-terms';

  constructor(private http: HttpClient) {}

  getAll(): Observable<PaymentTerm[]> {
    return this.http.get<PaymentTerm[]>(this.baseUrl);
  }

  getById(id: string): Observable<PaymentTerm> {
    return this.http.get<PaymentTerm>(`${this.baseUrl}/${id}`);
  }

  create(term: PaymentTerm): Observable<PaymentTerm> {
    return this.http.post<PaymentTerm>(this.baseUrl, term);
  }

  update(id: string, term: PaymentTerm): Observable<PaymentTerm> {
    return this.http.put<PaymentTerm>(`${this.baseUrl}/${id}`, term);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
